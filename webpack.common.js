const path = require('path');

const SRC_DIR = path.join(__dirname, '/client/src');

module.exports = {
  entry: `${SRC_DIR}/index.jsx`,
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
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
