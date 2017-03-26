/* eslint-disable import/no-extraneous-dependencies */
const webpack = require('webpack');
const merge = require('webpack-merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const baseWebpackConfig = require('./webpack.base.conf.js');
const commons = require('./commons');
const utils = require('./utils');

module.exports = merge(baseWebpackConfig, {
  devtool: '#cheap-module-source-map',

  module: {
    rules: utils.styleLoaders({
      sourceMap: true,
      extract: true,
    }),
  },

  output: {
    filename: 'js/[name].[chunkhash].js',
    chunkFilename: 'js/[id].[chunkhash].js',
    publicPath: '/static/',
  },

  plugins: [
    new webpack.LoaderOptionsPlugin(merge(commons, {
      options: {
        minimize: true,
        debug: false,
      },
    })),

    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false,
      },
    }),

    new ExtractTextPlugin({
      filename: 'css/[name].[contenthash:7].css',
      allChunks: true,
    }),

    new HtmlWebpackPlugin({
      template: './index.html',
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true,
      },
      chunksSortMode: 'dependency',
    }),

    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks(module) {
        return module.context && module.context.indexOf('node_modules') !== -1;
      },
    }),

    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      chunks: ['vendor'],
    }),
  ],
});
