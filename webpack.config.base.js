const path = require('path');
const webpack = require('webpack');
const packageConfig = require('./package.json');

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
      use: {
        loader: 'babel-loader',
        options: {
          plugins: [
            [
              '@babel/plugin-transform-runtime',
              {
                corejs: 2,
              },
            ],
          ],
        },
      },
    }],
  },
  plugins: [
    new webpack.BannerPlugin(`jun-utils v${packageConfig.version}\n\nCopyright 2018-present, 小巷 <xwjune@163.com>, Inc.\nAll rights reserved.`),
  ],
};
