const { ContextReplacementPlugin } = require("webpack")
const NodemonPlugin = require("nodemon-webpack-plugin")
const path = require("path")

module.exports = {
  target: "node",
  mode: "development",
  entry: "./frontend/src/main.js",
  output: {
    filename: "[name].js",
    publicPath: "/frontend/dist/",
    chunkFilename: "[name].bundle.js",
    path: `${__dirname}/frontend/dist`
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
            plugins: ["@babel/plugin-syntax-dynamic-import"]
          }
        }
      },

      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: "ignore-loader"
          }
        ]
      },
      {
        test: /\.(png|jpe?g|gif)$/,
        use: [
          {
            loader: "file-loader"
          },
          {
            loader: "url-loader"
          }
        ]
      }
    ]
  },
  plugins: [
    new NodemonPlugin(),
    //For fixing warning https://github.com/Automattic/mongoose/issues/7476
    new ContextReplacementPlugin(/.*/)
  ]
}
