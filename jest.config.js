const path = require('path');

module.exports = {
  rootDir: path.resolve(__dirname, process.env.ROOT_DIR ? process.env.ROOT_DIR : 'src'),
};
