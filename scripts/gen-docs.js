/* eslint-disable no-console */
/**
 * docs/api/*.md 与 README API 索引表 的生成器：src 源码 JSDoc 是唯一事实来源。
 *
 * 解析策略：@babel/parser 拿 AST 后只做两件事——
 *   1. 收集"带名可绑定节点"（函数/类/类属性/对象成员/箭头函数赋值）；
 *   2. 每个 /** 块认领其后最近的 bindable，同一 bindable 被多处认领时取距离最近者。
 * 该规则一并覆盖三类源码形态：JSDoc 与函数之间隔着正则常量（check/phone.js）、
 * 文件头注释穿墙认领首个函数（common/index.js）、同名内部函数与导出成员并存（floatUtil）。
 *
 * 用法：node scripts/gen-docs.js [--check]（--check 只校验 drift 不写盘，供 CI/手动核对）
 */

const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');

const ROOT = path.resolve(__dirname, '..');
const SRC_INDEX = path.join(ROOT, 'src', 'index.js');
const DOCS_DIR = path.join(ROOT, 'docs', 'api');
const README_PATH = path.join(ROOT, 'README.md');
const GEN_MARKER = '<!-- gen-docs: 此文件由 scripts/gen-docs.js 从 JSDoc 自动生成，勿手改；npm run docs:gen -->';
const README_START = '<!-- gen-docs:start -->';
const README_END = '<!-- gen-docs:end -->';
// 与 .babelrc 的语法面（class 属性、可选链、??）对齐，只解析不转译
const PARSER_OPTIONS = {
  sourceType: 'module',
  plugins: ['classProperties', 'optionalChaining', 'nullishCoalescingOperator'],
};
const SKIP_KEYS = new Set([
  'loc', 'start', 'end', 'range', 'comments', 'leadingComments', 'trailingComments', 'innerComments',
]);

const warnings = [];
const errors = [];

function rel(absPath) {
  return path.relative(ROOT, absPath).replace(/\\/g, '/');
}

function escapeRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** 递归遍历 AST（无需 @babel/traverse） */
function walk(node, visit) {
  if (!node || typeof node.type !== 'string') return;
  visit(node);
  Object.keys(node).forEach((key) => {
    if (SKIP_KEYS.has(key)) return;
    const value = node[key];
    if (Array.isArray(value)) {
      value.forEach((child) => walk(child, visit));
    } else {
      walk(value, visit);
    }
  });
}

function isFunctionLike(node) {
  return node
    && (node.type === 'ArrowFunctionExpression' || node.type === 'FunctionExpression');
}

function paramNames(fnNode) {
  if (!fnNode || !fnNode.params) return [];
  return fnNode.params.map((param) => {
    if (param.type === 'Identifier') return param.name;
    if (param.type === 'AssignmentPattern' && param.left.type === 'Identifier') return param.left.name;
    return '...';
  });
}

/** 带名可绑定节点；memberScope 用于同名消歧：导出对象/类成员上的 JSDoc 优先 */
function toBindable(node) {
  if (node.type === 'FunctionDeclaration' && node.id) {
    return { name: node.id.name, start: node.start, memberScope: 0, fnNode: node };
  }
  if (node.type === 'ClassDeclaration' && node.id) {
    const classMembers = node.body.body
      .filter((member) => member.type === 'ClassProperty' && member.key)
      .map((member) => member.key.name);
    return { name: node.id.name, start: node.start, memberScope: 0, classMembers, fnNode: null };
  }
  if (node.type === 'VariableDeclarator' && node.id.type === 'Identifier' && isFunctionLike(node.init)) {
    return { name: node.id.name, start: node.start, memberScope: 0, fnNode: node.init };
  }
  if (node.type === 'ClassProperty' && node.key && isFunctionLike(node.value)) {
    return { name: node.key.name, start: node.start, memberScope: 1, fnNode: node.value };
  }
  if (node.type === 'ObjectMethod' && node.key) {
    return { name: node.key.name, start: node.start, memberScope: 1, fnNode: node };
  }
  return null;
}

/**
 * 单文件事实收集：JSDoc 认领表、模块头、导入映射、导出序
 */
function collectFileFacts(absPath) {
  const code = fs.readFileSync(absPath, 'utf8');
  let ast;
  try {
    ast = parser.parse(code, PARSER_OPTIONS);
  } catch (e) {
    throw new Error(`${rel(absPath)} 语法解析失败：${e.message}`);
  }

  const bindables = [];
  walk(ast, (node) => {
    const bindable = toBindable(node);
    if (bindable) bindables.push(bindable);
  });

  // 默认导出形态：对象字面量（键序）/ new 类（类成员键序）/ 标识符或函数声明（callable）
  let exportsOrder = null;
  let callableName = null;
  let classExportName = null;
  ast.program.body.forEach((node) => {
    if (node.type !== 'ExportDefaultDeclaration') return;
    const decl = node.declaration;
    if (decl.type === 'ObjectExpression') {
      exportsOrder = decl.properties
        .filter((property) => property.key && property.key.name)
        .map((property) => property.key.name);
    } else if (decl.type === 'NewExpression' && decl.callee.type === 'Identifier') {
      classExportName = decl.callee.name;
    } else if (decl.type === 'Identifier') {
      callableName = decl.name;
    } else if (decl.type === 'FunctionDeclaration' && decl.id) {
      callableName = decl.id.name;
    }
  });
  if (classExportName) {
    const classBindable = bindables.find((b) => b.name === classExportName && b.classMembers);
    if (classBindable) exportsOrder = classBindable.classMembers;
  }

  // 本文件导出名集合：具名导出 + 默认导出（键序/callable），JSDoc 认领时优先命中
  const ownExportNames = new Set(exportsOrder || []);
  if (callableName) ownExportNames.add(callableName);
  ast.program.body.forEach((node) => {
    if (node.type === 'ExportDefaultDeclaration') {
      const decl = node.declaration;
      if (decl.type === 'FunctionDeclaration' && decl.id) ownExportNames.add(decl.id.name);
    } else if (node.type === 'ExportNamedDeclaration') {
      if (node.declaration && node.declaration.id) ownExportNames.add(node.declaration.id.name);
      node.specifiers.forEach((spec) => ownExportNames.add(spec.local.name));
    }
  });

  // JSDoc 竞争认领：每个 /** 块优先认领其后最近的「导出 bindable」，无导出候选才落到最近 bindable。
  // 前者优先覆盖 JSDoc 与导出函数之间隔着辅助函数的形态（idCard.js 的 isValidDate）；
  // 竞争取距离最近者，覆盖隔着正则常量（phone.js）与文件头穿墙（common/index.js）两类形态，
  // 同时保证内部函数前面的 JSDoc（floatUtil.operation）会被导出成员的自有 JSDoc 挤掉
  const claims = new Map();
  ast.comments.forEach((comment) => {
    if (comment.type !== 'CommentBlock' || !comment.value.startsWith('*')) return;
    let nearest = null;
    let nearestExported = null;
    bindables.forEach((bindable) => {
      if (bindable.start < comment.end) return;
      const distance = bindable.start - comment.end;
      if (!nearest || distance < nearest.distance) nearest = { bindable, distance };
      if (!ownExportNames.has(bindable.name)) return;
      if (!nearestExported || distance < nearestExported.distance) {
        nearestExported = { bindable, distance };
      }
    });
    const claim = nearestExported || nearest;
    if (!claim) return;
    const prev = claims.get(claim.bindable);
    if (!prev || claim.distance < prev.distance) {
      claims.set(claim.bindable, { comment, distance: claim.distance });
    }
  });

  const doclets = new Map(); // 名称 -> { raw, memberScope }
  // 函数事实（AST 参数、函数节点）与 doclet 同规则按 memberScope 消歧：
  // 同名内部函数先出现时不遮蔽导出成员（floatUtil.multiply）
  const fnsByName = new Map(); // 名称 -> { params, fnNode, memberScope }
  bindables.forEach((bindable) => {
    const claim = claims.get(bindable);
    if (claim) {
      const existing = doclets.get(bindable.name);
      if (!existing || bindable.memberScope > existing.memberScope) {
        doclets.set(bindable.name, { raw: claim.comment.value, memberScope: bindable.memberScope });
      }
    }
    if (bindable.fnNode) {
      const existing = fnsByName.get(bindable.name);
      if (!existing || bindable.memberScope > existing.memberScope) {
        fnsByName.set(bindable.name, {
          params: paramNames(bindable.fnNode),
          fnNode: bindable.fnNode,
          memberScope: bindable.memberScope,
        });
      }
    }
  });

  const importMap = new Map(); // 本地绑定名 -> 源文件绝对路径
  ast.program.body.forEach((node) => {
    if (node.type !== 'ImportDeclaration') return;
    const sourceResolved = path.resolve(path.dirname(absPath), node.source.value);
    // import source 省略 .js 扩展名（'./phone'），补全后再落盘
    const sourceAbs = fs.existsSync(sourceResolved) ? sourceResolved : `${sourceResolved}.js`;
    node.specifiers.forEach((spec) => importMap.set(spec.local.name, sourceAbs));
  });

  // 模块头：文件首个 /** 块。若它同时是某公开函数的 doclet（ws 单函数模块兼任），则留空回退
  const firstBlock = ast.comments.find((c) => c.type === 'CommentBlock' && c.value.startsWith('*'));
  let moduleDoc = null;
  if (firstBlock) {
    const publicSet = new Set(exportsOrder || (callableName ? [callableName] : []));
    let claimedByPublic = false;
    claims.forEach(({ comment }, bindable) => {
      if (comment === firstBlock && publicSet.has(bindable.name)) claimedByPublic = true;
    });
    if (!claimedByPublic) moduleDoc = firstBlock.value;
  }

  return {
    path: absPath, doclets, fnsByName, importMap, exportsOrder, callableName, moduleDoc,
  };
}

/** @param 名字段的机械解包：[options.digit=2] -> { path, optional, defaultText } */
function makeParam(type, nameRaw, description) {
  let nameText = nameRaw;
  let optional = false;
  if (nameText.startsWith('[') && nameText.endsWith(']')) {
    optional = true;
    nameText = nameText.slice(1, -1);
  }
  let defaultText;
  const eq = nameText.indexOf('=');
  if (eq !== -1) {
    defaultText = nameText.slice(eq + 1);
    nameText = nameText.slice(0, eq);
  }
  return {
    path: nameText,
    depth: nameText.includes('.') ? 1 : 0,
    type: type.trim(),
    optional,
    defaultText,
    description,
  };
}

/**
 * JSDoc 文本解析：首个 @example 之后的整段视为示例原文（本库约定 @example 总在最后），
 * 此前按 @tag 行解析，缩进续行并入上一个 tag
 */
function parseJSDoc(raw) {
  // 源文件多为 CRLF 行尾，注释 value 里带着 \r，统一清掉再逐行剥 '*' 前缀
  // 星号后不强制空格：pwdIntensity 的 '*（1）' 这类紧跟正文的行首也要剥
  const lines = raw.replace(/\r\n/g, '\n')
    .split('\n')
    .map((line) => line.replace(/^\s*\*\s?/, '').replace(/\s+$/, ''));
  while (lines.length > 0 && lines[0] === '') lines.shift();
  while (lines.length > 0 && lines[lines.length - 1] === '') lines.pop();

  const exampleIndex = lines.findIndex((line) => line.trim().startsWith('@example'));
  const headLines = exampleIndex === -1 ? lines : lines.slice(0, exampleIndex);
  const example = exampleIndex === -1
    ? ''
    : lines.slice(exampleIndex + 1).join('\n').replace(/^\n+/, '').replace(/\n+$/, '');

  const firstTagIndex = headLines.findIndex((line) => line.trim().startsWith('@'));
  const descriptionLines = firstTagIndex === -1
    ? headLines.slice()
    : headLines.slice(0, firstTagIndex);
  while (descriptionLines.length > 0 && descriptionLines[0] === '') descriptionLines.shift();
  while (descriptionLines.length > 0 && descriptionLines[descriptionLines.length - 1] === '') descriptionLines.pop();

  const rawTags = [];
  headLines.slice(Math.max(firstTagIndex, 0)).forEach((line) => {
    if (firstTagIndex === -1) return;
    const trimmed = line.trim();
    if (trimmed.startsWith('@')) {
      rawTags.push({ line: trimmed, continuation: [] });
    } else if (rawTags.length > 0) {
      rawTags[rawTags.length - 1].continuation.push(trimmed);
    }
  });

  const params = [];
  let returns = null;
  rawTags.forEach(({ line, continuation }) => {
    const paramMatch = line.match(/^@param\s+\{([^}]*)\}\s+(\S+)(?:\s+-\s*(.*))?$/);
    if (paramMatch) {
      const description = [paramMatch[3] || '']
        .concat(continuation.filter(Boolean))
        .join(' ');
      params.push(makeParam(paramMatch[1], paramMatch[2], description));
      return;
    }
    const returnMatch = line.match(/^@returns?\s+(.*)$/);
    if (returnMatch) {
      const typeMatch = returnMatch[1].match(/^\{([^}]*)\}\s*(.*)$/);
      returns = typeMatch
        ? { type: typeMatch[1], text: [typeMatch[2]].concat(continuation).join(' ').trim() }
        : { type: '', text: [returnMatch[1]].concat(continuation).join(' ').trim() };
      return;
    }
    warnings.push(`未知 tag：${line.split(/\s+/)[0]}`);
  });

  return { descriptionLines, params, returns, example };
}

/** 模块头 JSDoc 中的 "fnName - 一句话" 函数索引行不属于模块描述 */
function moduleDescriptionLines(moduleDoc) {
  if (!moduleDoc) return [];
  const parsed = parseJSDoc(moduleDoc);
  return parsed.descriptionLines.filter((line) => line && !/^\S+\s+- /.test(line));
}

function resolveModules() {
  const code = fs.readFileSync(SRC_INDEX, 'utf8');
  const ast = parser.parse(code, PARSER_OPTIONS);
  const specs = [];
  ast.program.body.forEach((node) => {
    if (node.type !== 'ExportNamedDeclaration' || !node.source) return;
    node.specifiers.forEach((spec) => {
      if (spec.type !== 'ExportSpecifier' || spec.local.name !== 'default') return;
      const name = spec.exported.name;
      const entry = path.resolve(path.dirname(SRC_INDEX), node.source.value);
      const entryPath = fs.existsSync(path.join(entry, 'index.js'))
        ? path.join(entry, 'index.js')
        : `${entry}.js`;
      specs.push({ name, entryPath });
    });
  });
  if (specs.length === 0) errors.push('src/index.js 中未解析到任何模块导出');
  return specs;
}

function buildModule(spec) {
  const entry = collectFileFacts(spec.entryPath);
  const publicNames = entry.exportsOrder || (entry.callableName ? [entry.callableName] : []);
  const callable = Boolean(entry.callableName) && !entry.exportsOrder;

  const fns = publicNames.map((name) => {
    let docletRaw = null;
    const ownInfo = entry.fnsByName.get(name);
    let astParams = ownInfo?.params || [];
    let fnNode = ownInfo?.fnNode || null;
    let sourceFile = entry.path;
    const own = entry.doclets.get(name);
    if (own) {
      docletRaw = own.raw;
    } else {
      const leafPath = entry.importMap.get(name);
      if (leafPath && fs.existsSync(leafPath)) {
        const leaf = collectFileFacts(leafPath);
        const leafDoclet = leaf.doclets.get(name);
        if (leafDoclet) docletRaw = leafDoclet.raw;
        const leafInfo = leaf.fnsByName.get(name);
        astParams = leafInfo?.params || astParams;
        fnNode = leafInfo?.fnNode || fnNode;
        sourceFile = leafPath;
      }
    }
    if (docletRaw === null) {
      errors.push(`${spec.name}.${name} 缺 JSDoc（${rel(sourceFile)}）——JSDoc 是文档唯一来源，请补写`);
      return { name, missing: true };
    }
    const doclet = parseJSDoc(docletRaw);
    if (!doclet.example) warnings.push(`${spec.name}.${name} 缺 @example（${rel(sourceFile)}）`);
    if (!doclet.returns) warnings.push(`${spec.name}.${name} 缺 @return（${rel(sourceFile)}）`);
    return { name, doclet, astParams, fnNode, sourceFile };
  });

  // 模块描述：ws 这类单函数模块的文件头兼任函数 doclet，回退取函数描述首行
  let descLines = moduleDescriptionLines(entry.moduleDoc);
  if (descLines.length === 0 && callable && fns[0] && fns[0].doclet) {
    descLines = fns[0].doclet.descriptionLines.filter((line) => line);
  }

  return {
    name: spec.name,
    callable,
    publicNames,
    descriptionFirstLine: descLines[0] || spec.name,
    descriptionRestLines: descLines.slice(1),
    fns,
  };
}

function normalizeType(type) {
  return type
    .split('|')
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => part.charAt(0).toLowerCase() + part.slice(1))
    .join(' \\| ');
}

function escapeCell(text) {
  return text.replace(/\|/g, '\\|');
}

/** 单个参数的签名片段：可选参数包 []，带默认值时内联 =default */
function paramSignature(param) {
  if (!param.optional) return param.path;
  if (param.defaultText !== undefined) return `[${param.path}=${param.defaultText}]`;
  return `[${param.path}]`;
}

function renderSignature(fn, module) {
  const displayName = module.callable ? module.name : fn.name;
  const params = fn.doclet && fn.doclet.params.length > 0
    ? fn.doclet.params.filter((param) => param.depth === 0)
    : [];
  const parts = params.length > 0 ? params.map(paramSignature) : fn.astParams;
  return `${displayName}(${parts.join(', ')})`;
}

/** 示例统一为命名空间调用形态：裸函数名 -> ns.fn(；callable 模块 -> ws( */
function prefixExample(example, module) {
  if (module.callable) {
    return module.publicNames.reduce(
      (text, name) => text.replace(
        new RegExp(`(?<![.\\w$])${escapeRegExp(name)}\\s*\\(`, 'g'),
        `${module.name}(`,
      ),
      example,
    );
  }
  const names = module.publicNames
    .filter(Boolean)
    .sort((a, b) => b.length - a.length);
  if (names.length === 0) return example;
  const pattern = new RegExp(`(?<![.\\w$])(${names.map(escapeRegExp).join('|')})\\s*\\(`, 'g');
  return example.replace(pattern, `${module.name}.$1(`);
}

// 句末标点：行尾不是这些时，视为源码控宽折行，与下一行拼回一句
const SENTENCE_END_RE = /[。．？！；：）】”』》…]$/;
// CJK 交界（汉字/CJK标点/全角符号）拼接不加空格，其余交界补一个空格
function isCjkChar(ch) {
  const code = ch.charCodeAt(0);
  return (code >= 0x4e00 && code <= 0x9fff) // 汉字
    || (code >= 0x3000 && code <= 0x303f) // CJK 标点（含全角空格）
    || (code >= 0xff00 && code <= 0xffef); // 全角字母数字、全角符号
}
const LIST_MARKER_RE = /^([-*+]|\d+\.)\s+(.*)$/;

function joinWrapped(prev, next) {
  const tail = prev.charAt(prev.length - 1);
  const head = next.charAt(0);
  return isCjkChar(tail) && isCjkChar(head) ? prev + next : `${prev} ${next}`;
}

/**
 * JSDoc 描述 → markdown 块，按语义重排而非透传源码分行：
 *   - 空行分段；"- " / "1. " 顶格行为列表项，其缩进续行与嵌套列表项归入该项（输出补齐对齐缩进）；
 *   - 段内普通行：上一行句末标点收尾则保留分行，否则拼回一句——控宽折行不在文档里断句。
 */
function pushDescription(out, descriptionLines) {
  const blocks = [];
  let prose = [];
  let list = null; // { type: 'list', items: [{ marker, lines: [对齐后的完整行] }] }

  const flushProse = () => {
    if (prose.length > 0) {
      blocks.push({ type: 'prose', lines: prose });
      prose = [];
    }
  };
  const flushList = () => {
    if (list) {
      blocks.push(list);
      list = null;
    }
  };

  descriptionLines.forEach((line) => {
    const text = line.trim();
    if (text === '') {
      flushProse();
      flushList();
      return;
    }
    const indent = line.length - line.replace(/^\s+/, '').length;
    const markerMatch = text.match(LIST_MARKER_RE);
    if (markerMatch && indent === 0) {
      flushProse();
      if (!list) list = { type: 'list', items: [] };
      list.items.push({ marker: markerMatch[1], lines: [markerMatch[2]] });
      return;
    }
    if (list) {
      // 列表项的缩进续行/嵌套项：补齐到本项内容的对齐列，markdown 才稳定归属
      const item = list.items[list.items.length - 1];
      const pad = ' '.repeat(item.marker.length + 1);
      item.lines.push(markerMatch ? `${pad}${markerMatch[1]} ${markerMatch[2]}` : pad + text);
      return;
    }
    flushList();
    if (prose.length > 0 && SENTENCE_END_RE.test(prose[prose.length - 1])) {
      prose.push(text);
    } else if (prose.length > 0) {
      prose[prose.length - 1] = joinWrapped(prose[prose.length - 1], text);
    } else {
      prose.push(text);
    }
  });
  flushProse();
  flushList();

  blocks.forEach((block, index) => {
    if (index > 0) out.push('');
    if (block.type === 'prose') {
      out.push(block.lines.join('  \n'));
    } else {
      block.items.forEach((item) => {
        out.push(`${item.marker} ${item.lines[0]}`);
        item.lines.slice(1).forEach((cont) => out.push(cont));
      });
    }
  });
  if (blocks.length > 0) out.push('');
}

function renderFunction(fn, module) {
  if (fn.missing) return [];
  const out = [`## ${renderSignature(fn, module)}`];
  const descriptionLines = fn.doclet.descriptionLines;
  if (module.callable && descriptionLines[0] === module.descriptionFirstLine) {
    // callable 单函数模块（ws）的摘要行已在模块头粗体出现，函数块直接从详细描述开始
    pushDescription(out, descriptionLines.slice(1));
  } else if (descriptionLines.length > 0) {
    // 摘要行（JSDoc 首段）加粗，与空行后的详细描述区分样式，与模块头一致
    out.push(`**${descriptionLines[0]}**`, '');
    pushDescription(out, descriptionLines.slice(1));
  }
  if (fn.doclet.params.some((param) => param.depth === 1)) {
    out.push('### API');
    out.push('| Property | Description | Type | Default |');
    out.push('| :------- | :---------- | :--- | :------ |');
    fn.doclet.params.forEach((param) => {
      const def = param.defaultText !== undefined ? param.defaultText : '-';
      out.push(`| ${param.path} | ${escapeCell(param.description)} | ${normalizeType(param.type)} | ${def} |`);
    });
    out.push('');
  }
  if (fn.doclet.example) {
    out.push('```JavaScript');
    out.push(prefixExample(fn.doclet.example, module));
    out.push('```');
  }
  // 去掉块尾多余空行，函数块之间统一由上层补一个空行
  while (out.length > 0 && out[out.length - 1] === '') out.pop();
  return out;
}

function renderModuleDoc(module) {
  const out = [GEN_MARKER, `# ${module.name}`, `**${module.descriptionFirstLine}**`];
  if (module.descriptionRestLines.length > 0) {
    out.push('');
    pushDescription(out, module.descriptionRestLines);
  } else {
    out.push('');
  }
  out.push('```JavaScript');
  out.push(`import { ${module.name} } from 'jun-utils';`);
  out.push('```');
  out.push('');
  module.fns.forEach((fn) => {
    const block = renderFunction(fn, module);
    if (block.length === 0) return;
    out.push(...block);
    out.push('');
  });
  while (out.length > 0 && out[out.length - 1] === '') out.pop();
  out.push('');
  out.push('---');
  out.push('');
  out.push('[← 返回 API 索引](../../README.md#api)');
  return `${out.join('\n')}\n`;
}

function renderReadmeSection(modules) {
  const rows = modules.map((module) => (
    `| [${module.name}](docs/api/${module.name}.md) | ${module.descriptionFirstLine} | ${module.fns.length} |`
  ));
  return [
    README_START,
    '| 模块 | 说明 | 函数 |',
    '| :--- | :--- | :--- |',
    ...rows,
    README_END,
  ].join('\n');
}

/** 读文件统一归一 CRLF 后比对，写盘统一 LF——core.autocrlf=true 下保证幂等 */
function readNormalized(absPath) {
  if (!fs.existsSync(absPath)) return null;
  return fs.readFileSync(absPath, 'utf8').replace(/\r\n/g, '\n');
}

function main() {
  const checkMode = process.argv.includes('--check');
  const specs = resolveModules();
  const modules = specs.map(buildModule);

  if (errors.length > 0) {
    errors.forEach((message) => console.error(`[gen-docs] ERROR ${message}`));
    process.exit(1);
  }

  const results = []; // { absPath, content }
  modules.forEach((module) => {
    results.push({ absPath: path.join(DOCS_DIR, `${module.name}.md`), content: renderModuleDoc(module) });
  });
  const readmeContent = readNormalized(README_PATH);
  if (readmeContent === null) {
    console.error('[gen-docs] ERROR README.md 不存在');
    process.exit(1);
  }
  const startIndex = readmeContent.indexOf(README_START);
  const endIndex = readmeContent.indexOf(README_END);
  if (startIndex === -1 || endIndex === -1 || endIndex < startIndex) {
    console.error(`[gen-docs] ERROR README.md 缺少 ${README_START} / ${README_END} 标记区块`);
    process.exit(1);
  }
  const newReadme = readmeContent.slice(0, startIndex)
    + renderReadmeSection(modules)
    + readmeContent.slice(endIndex + README_END.length);

  let drift = false;
  const targets = results.concat([{ absPath: README_PATH, content: newReadme }]);
  targets.forEach(({ absPath, content }) => {
    const current = readNormalized(absPath);
    if (current === content) return;
    drift = true;
    if (checkMode) {
      console.error(`[gen-docs] drift: ${rel(absPath)} 与 JSDoc 不一致`);
      return;
    }
    fs.writeFileSync(absPath, content, 'utf8');
    console.log(`[gen-docs] 已生成 ${rel(absPath)}`);
  });

  // 孤儿清理：带生成标记但模块已不存在的文档随生成删除（无标记的手写文件不碰）
  if (fs.existsSync(DOCS_DIR)) {
    const generatedNames = new Set(modules.map((module) => `${module.name}.md`));
    fs.readdirSync(DOCS_DIR).forEach((filename) => {
      if (!filename.endsWith('.md') || generatedNames.has(filename)) return;
      const absPath = path.join(DOCS_DIR, filename);
      if (readNormalized(absPath)?.startsWith(GEN_MARKER)) {
        if (checkMode) {
          console.error(`[gen-docs] drift: ${rel(absPath)} 对应模块已不存在`);
          drift = true;
        } else {
          fs.unlinkSync(absPath);
          console.log(`[gen-docs] 已删除孤儿文档 ${rel(absPath)}`);
        }
      }
    });
  }

  warnings.forEach((message) => console.error(`[gen-docs] WARN ${message}`));
  modules.forEach((module) => {
    console.log(`[gen-docs] ${module.name}: ${module.fns.length} 个函数`);
  });
  if (checkMode && drift) process.exit(1);
}

// 直接执行时生成文档；被 require 时导出解析能力供脚本复用（如参数审计）
if (require.main === module) {
  main();
}

module.exports = { resolveModules, buildModule };
