const Webpack = require("webpack")
const Dotenv = require("dotenv-webpack")
const path = require("path")

const IS_DEV = process.env.NODE_ENV === "development"

const plugins = [new Dotenv()]

if (IS_DEV) {
  plugins.push(new Webpack.HotModuleReplacementPlugin())
} else {
  plugins.push(
    new Webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
    })
  )
}

module.exports = {
  devtool: IS_DEV ? "cheap-module-source-map" : "eval",
  entry: "./src/index.js",
  output: {
    filename: "bundle.js",
    path: path.join(__dirname, "dist"),
  },
  resolve: {
    modules: [path.resolve(__dirname, "src"), "node_modules"],
    extensions: [".json", ".js", ".jsx"],
  },
  plugins,
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: "babel-loader",
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  devServer: {
    historyApiFallback: true,
    port: 3000,
    compress: false,
    static: {
      directory: path.join(__dirname, "dist"),
    },
    hot: true,
    open: false,
  },
}
