const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  entry: "./webpack-demo/src/index.ts",

  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },

  resolve: {
    extensions: [".ts", ".js"],
  },

  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: "ts-loader",
      },
    ],
  },

  plugins: [
    // Plugin 1: replaces APP_NAME in the code at build time
    new webpack.DefinePlugin({
      APP_NAME: JSON.stringify("Maruthani World"),
    }),

    // Plugin 2: generates dist/index.html and injects bundle.js
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "public/index.html"),
    }),
  ],

  devServer: {
    static: {
      directory: path.resolve(__dirname, "dist"),
    },
    port: 8081,
    // REST endpoint: forward /api calls to the Node/Express server
    proxy: [{ context: ["/api"], target: "http://localhost:5000" }],
    open: false,
    hot: true,
  },
};
