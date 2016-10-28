const webpack = require('webpack');
const path = require('path');
// const fs = require('fs');
const glob = require('glob');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const rootPath = path.resolve(process.cwd(), 'src');

function getEntry() {
  const jsPath = path(rootPath, 'js');
  const filesArray = glob.sync(jsPath + '/*.js');
  const map = {};
  filesArray.map(filePath => {
    const filename = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'));
    map[filename] = filePath;
  });
  return map;
}

module.exports = {
  entry: Object.assign(getEntry(), {
    'vender': ['zepto'],
  }),
  output: {
    path: assets,
    filename: dev ? '[name].js' : 'js/[chunkhash:8].[name].min.js',
    chunkFilename: dev ? '[chunkhash:8].chunk.js' : 'js/[chunkhash:8].chunk.min.js',
    hotUpdateChunkFilename: dev ? '[id].js' : 'js/[id].[chunkhash:8].min.js',
    publicPath: publicPath
  },
  resolve: {
    root: [srcDir, nodeModPath],
    alias: require('../path.json'),
    extensions: ['', '.js', '.css', '.less', '.tpl', '.png', '.jpg']
  },

  module: {
    loaders: [{
      test: /\.((woff2?|svg)(\?v=[0-9]\.[0-9]\.[0-9]))|(woff2?|svg|jpe?g|png|gif|ico)$/,
      loaders: [
        'url?limit=10000&name=img/[hash:8].[name].[ext]',
        'image?{bypassOnDebug:true, progressive:true,optimizationLevel:3,pngquant:{quality:"65-80",speed:4}}'
      ]
    }, {
      test: /\.((ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9]))|(ttf|eot)$/,
      loader: 'url?limit=10000&name=fonts/[hash:8].[name].[ext]'
    }, {
      test: /\.(tpl|ejs)$/,
      loader: 'ejs'
    }, {
      test: /\.css$/,
      loader: cssLoader
    }, {
      test: /\.less$/,
      loader: 'style-loader!css-loader!less-loader'
    }]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false }}),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'common-b-c',
      chunks: ['b', 'c']
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'common',
      chunks: ['common-b-c', 'a']
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vender',
      chunks: ['common']
    })
  ],
  devServer: {
    // hot: true,
    noInfo: false,
    inline: true,
    publicPath: publicPath,
    stats: {
      cached: false,
      colors: true
    }
  }
};
