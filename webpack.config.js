const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const Dotenv = require("dotenv-webpack");

module.export = {
  entry: "./src/app.js",
  output: {
    filename: "bundle.js",
  },
  devtool: "source-maps",
  module: {
    rules: [
      { test: /\.jsx?$/, loader: "babel-loader", exclude: /node_modules/ },
      { test: /\.jsx?$/, loader: ["style-loader", "css-loader"] },
    ],
  },
  devServer: {
    contentBase: "src",
    hot: true,
    open: true,
    port: 5050,
    watchContentBase: true,
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      filename: "index.html",
      inject: "body",
    }),
    new Dotenv(),
  ],
};
