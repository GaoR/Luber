const path = require('path');

const SRC_DIR = path.join(__dirname, '/client/src');
const DIST_DIR = path.join(__dirname, '/public');

module.exports = {
  devtool: 'eval-source-map',
  entry: `${SRC_DIR}/index.jsx`,
  output: {
    filename: 'bundle.js',
    path: DIST_DIR,
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: [/node_modules/, /client\/src\/tests/],
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/react', '@babel/env'],
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.webpack.js', '.web.js', '.js', '.json', '.jsx'],
  },
};
