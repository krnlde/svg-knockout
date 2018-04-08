const webpack = require('webpack');
const path = require('path');

module.exports = {
  mode: 'development',
  entry: './app/index.js',
  output: {
    publicPath: '/bundle/',
    path: path.resolve(__dirname, 'bundle'),
    filename: '[name].js',
  },
  devtool: 'eval-source-map',
  optimization: {
    splitChunks: {
      cacheGroups: {
        default: false,
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all',
        }
      }
    }
  },
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
