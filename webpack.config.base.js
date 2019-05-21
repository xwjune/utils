const path = require('path');
const webpack = require('webpack');
const pkg = require('./package.json');

module.exports = {
  entry: {
    [pkg.name]: './src/index',
  },
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
    new webpack.BannerPlugin(`${pkg.name} v${pkg.version}\n\nCopyright 2018-present, ${pkg.author}, Inc.\nAll rights reserved.`),
  ],
};
