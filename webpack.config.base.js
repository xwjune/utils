const path = require('path');
const webpack = require('webpack');
const package = require('./package.json');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    library: 'junUtils',
    libraryTarget: 'umd',
  },
  resolve: {
    extensions: ['.js'],
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      use: ['babel-loader'],
    }],
  },
  plugins: [
    new webpack.BannerPlugin(`v${package.version} | Copyright © 小巷 <xwjune@163.com> | All rights reserved.`),
  ],
};
