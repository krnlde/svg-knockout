const webpack = require('webpack');
const path = require('path');

module.exports = {
  entry: './app/index.js',
  output: {
    filename: 'bundle/application.js'
  },
  devtool: '#cheap-source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/, loader: 'babel-loader'
      }
    ]
  },
  devServer: {
    contentBase: path.join(__dirname),
    compress: true,
    port: 9000
  },
  // plugins: [
  //   new webpack.optimize.UglifyJsPlugin()
  // ]
}
