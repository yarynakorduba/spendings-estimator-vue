const path = require("path")
const nodeExternals = require("webpack-node-externals")

const config = {
  entry: {
    polyfill: "babel-polyfill",
    app: "./src/index.js"
  },
  target: "node",
  externals: [nodeExternals()], // in order to ignore all modules in node_modules folder
  devtool: "source-map",

  output: {
    filename: "[name].js",
    publicPath: "/client/dist/",
    chunkFilename: "[name].bundle.js",
    path: `${__dirname}/client/dist`
  },

  module: {
    rules: [
      {
        test: /\.(js)$/,
        options: {
          configFile: path.join(__dirname, "..", "babel.config.js")
        },
        exclude: [/node_modules/],
        include: [/src/, path.join(__dirname, "..", "node_modules/@babel/runtime-corejs2/helpers/esm/")],
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)$/,
        loader: "file-loader",
        options: {
          limit: 10000,
          name: "[name].[hash:7].[ext]"
        }
      }
    ]
  },
  watch: true
}

module.exports = config
