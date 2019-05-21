const merge = require('webpack-merge');
const baseConfig = require('./webpack.config.base');

module.exports = merge(baseConfig, {
  devtool: 'none',
  mode: 'development',
  output: {
    filename: '[name].js',
  },
});
