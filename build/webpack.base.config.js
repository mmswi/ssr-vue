const path = require("path");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const FriendlyErrorsPlugin = require("friendly-errors-webpack-plugin");
const VueLoaderPlugin = require("vue-loader/lib/plugin");

// CSS extraction should only be enabled for production
// so that we still get hot-reload during development.
const isProd = process.env.NODE_ENV === "production";

module.exports = {
  mode: process.env.NODE_ENV,
  devtool: isProd ? false : "#cheap-module-source-map",
  output: {
    path: path.resolve(__dirname, "../dist"),
    publicPath: "/dist/",
    filename: "[name].[chunkhash].js"
  },
  resolve: {
    alias: {
      public: path.resolve(__dirname, "../public")
    }
  },
  module: {
    noParse: /es6-promise\.js$/, // avoid webpack shimming process
    rules: [
      {
        test: /\.vue$/,
        loader: "vue-loader",
        options: {
          // enable CSS extraction
          extractCSS: isProd,
          compilerOptions: {
            preserveWhitespace: false
          }
        }
      },
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: "url-loader",
        options: {
          limit: 10000,
          name: "[name].[ext]?[hash]"
        }
      },
      {
        test: /\.(sa|sc|c)ss$/,
        // important: use vue-style-loader instead of style-loader
        use: isProd
          ? [
              MiniCssExtractPlugin.loader,
              "css-loader",
              "vue-style-loader",
              "sass-loader"
            ]
          : ["vue-style-loader", "css-loader", "sass-loader"]
      }
    ]
  },
  performance: {
    hints: false
  },
  plugins: isProd
    ? [
        new VueLoaderPlugin(),
        new MiniCssExtractPlugin({ filename: "common.[chunkhash].css" })
      ]
    : [new VueLoaderPlugin(), new FriendlyErrorsPlugin()]
};
