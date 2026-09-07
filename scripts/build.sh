#!/bin/sh

# webpack 4 使用 md4 哈希,Node 17+ 的 OpenSSL 3 已移除,需启用 legacy provider
export NODE_OPTIONS=--openssl-legacy-provider

npm run build:lib && \
npm run build:umd && \
npm run build:umd:min
