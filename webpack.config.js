const resolve = require("path").resolve;
const HtmlWebpackPlugin = require("html-webpack-plugin");

const BABEL_CONFIG = {
  presets: ["@babel/env", "@babel/react"],
};

const config = {
  devServer: {
    disableHostCheck: true,
    contentBase: resolve("dist"),
    publicPath: "/",
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    compress: true,
  },

  entry: {
    app: resolve("./src/app.js"),
  },

  output: {
    chunkFilename: "[name].bundle.js",
    path: resolve("dist"),
  },

  module: {
    rules: [
      {
        // Compile ES2015 using babel
        test: /\.js$/,
        include: [resolve(".")],
        exclude: [/node_modules/],
        use: [
          {
            loader: "babel-loader",
            options: BABEL_CONFIG,
          },
        ],
      },
      {
        test: /\.(png|woff2|woff)$/,
        use: ["file-loader"],
      },
      {
        // enable SASS loading
        test: /\.scss$/i,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        // enable CSS loading
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        // JSON loading + geoJSON
        test: /\.geojson$/,
        use: ["json-loader"],
      },
    ],
  },

  optimization: {
    usedExports: true,
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: "index.html",
    }),
  ],
};

module.exports = config;
