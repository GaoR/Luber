const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

const DIST_DIR = path.join(__dirname, '/public');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist',
  },
  output: {
    filename: 'bundle.js',
    path: DIST_DIR,
  },
});
