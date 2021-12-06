const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const TerserJSPlugin = require("terser-webpack-plugin");
const ManifestPlugin = require("webpack-manifest-plugin");
const WorkboxWebpackPlugin = require("workbox-webpack-plugin");
const getPublicUrlOrPath = require("react-dev-utils/getPublicUrlOrPath");
const InterpolateHtmlPlugin = require("interpolate-html-plugin");
const webpack = require("webpack");
const fs = require("fs");
const UnusedWebpackPlugin = require("unused-webpack-plugin");
const CopyWebpack = require("copy-webpack-plugin");

const ScriptExtHtmlWebpackPlugin = require("script-ext-html-webpack-plugin");

const Dotenv = require("dotenv-webpack");

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);

const publicUrlOrPath = getPublicUrlOrPath(
  process.env.NODE_ENV === "development",
  require(resolveApp("package.json")).homepage,
  process.env.PUBLIC_URL
);

module.exports = (_, argv) => {
  return {
    mode: argv.mode === "production" ? "production" : "development",
    devtool: argv.mode === "production" ? "" : "source-map",
    bail: argv.mode === "production",
    // if the project is based on js files set entry to index.js
    entry: {
      common: ["react", "react-dom", "jss"],
      main: "./src/index.js",
    },

    output: {
      path: path.resolve(__dirname + "/dist"),
      publicPath: "/",
      filename:
        argv.mode === "production" ? "[name].[contenthash:8].js" : "[name].js",
      chunkFilename:
        argv.mode === "production"
          ? "assets/js/[name].[contenthash:8].js"
          : "[name].js",
    },

    devServer: {
      // this is for dev mode.
      //contentBase: './dist',
      // this is only for production mode.
      port: 3000,
      historyApiFallback: true,
      open: true,
    },

    resolve: {
      extensions: ["jsx", ".js"],
    },

    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: [
            {
              loader: "babel-loader",
              options: {
                plugins: [
                  "@babel/plugin-transform-runtime",
                  "@babel/plugin-proposal-logical-assignment-operators",
                ],
                // This is a feature of `babel-loader` for webpack (not Babel itself).
                // It enables caching results in ./node_modules/.cache/babel-loader/
                // directory for faster rebuilds.
                cacheDirectory: false,
                cacheCompression: false,
                compact: false,
              },
            },
          ],
        },

        {
          test: /\.css$/,
          use: [
            "style-loader",
            {
              loader: "css-loader",
              // active these options, while you want to use css files as modules.
              // so the files will be imported like a js module.
              // eg: import classes from "./style.css".
              // access to the class using => classes.className.
              options: {
                // while using the style as modules, it would be recommended to use camelcase format to name classes.
                // modules: true,
              },
            },
          ],
        },

        {
          test: /\.(jpe?g|png|gif|svg|webp)$/,
          loader: "file-loader",
          options: {
            name: "assets/[name]-[contenthash].[ext]",
            limit: 10000,
          },
        },
      ],
    },

    optimization: {
      minimize: argv.mode === "production",
      minimizer: [new OptimizeCSSAssetsPlugin({}), new TerserJSPlugin()],

      runtimeChunk: { name: "manifest" },

      splitChunks: {
        chunks: "all",
        maxInitialRequests: 5,
        maxAsyncRequests: 5,

        cacheGroups: {
          common: {
            chunks: "initial",
            minChunks: 2,
            maxInitialRequests: 5, // The default limit is too small to showcase the effect
            // minSize: 20, // This is example is too small to create commons chunks
            priority: 5,
          },

          main: {
            test: /[\\/]node_modules[\\/]/,
            name(module) {
              // get the name. E.g. node_modules/packageName/not/this/part.js
              // or node_modules/packageName
              const packageName = module.context.match(
                /[\\/]node_modules[\\/](.*?)([\\/]|$)/
              )[1];
              // npm package names are URL-safe, but some servers don't like @ symbols
              return `${packageName.replace("@", "")}`;
            },
          },
        },
      },
    },

    plugins: [
      new Dotenv(),
      new webpack.HashedModuleIdsPlugin(),
      new InterpolateHtmlPlugin({ PUBLIC_URL: "/public/" }),
      new UnusedWebpackPlugin({
        // Source directories
        directories: [path.join(__dirname, "src")],
        // Exclude patterns
        exclude: ["*.test.js"],
        // Root directory (optional)
        root: __dirname,
      }),
      new HtmlWebpackPlugin({
        // if you want to provide your own file, add this line of code to detect the path of the file.
        // otherwise let it empty.
        template: path.resolve("./index.html"),
        ...(argv.mode === "production"
          ? {
              inject: "body",
              minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeStyleLinkTypeAttributes: true,
                keepClosingSlash: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true,
              },
            }
          : null),
      }),

      new CopyWebpack({
        patterns: [{ from: "./public", to: "./public" }],
      }),

      new ScriptExtHtmlWebpackPlugin({
        preload: [/main/, /common/, /material-ui/, /jss/],
        defer: [/main/, /common/, /material-ui/, /jss/],
      }),

      new ManifestPlugin({
        fileName: "asset-manifest.json",
        publicPath: publicUrlOrPath,
        generate: (seed, files, entrypoints) => {
          const manifestFiles = files.reduce((manifest, file) => {
            manifest[file.name] = file.path;
            return manifest;
          }, seed);
          const entrypointFiles = entrypoints.main.filter(
            (fileName) => !fileName.endsWith(".map")
          );

          return {
            files: manifestFiles,
            entrypoints: entrypointFiles,
          };
        },
      }),

      // Moment.js is an extremely popular library that bundles large locale files
      // by default due to how webpack interprets its code. This is a practical
      // solution that requires the user to opt into importing specific locales.
      // https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
      // You can remove this if you don't use Moment.js:
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),

      ...(argv.mode === "production"
        ? [
            new WorkboxWebpackPlugin.GenerateSW({
              clientsClaim: true,
              exclude: [/\.map$/, /asset-manifest\.json$/],
              importWorkboxFrom: "cdn",
              navigateFallback: publicUrlOrPath + "index.html",
              navigateFallbackBlacklist: [
                // Exclude URLs starting with /_, as they're likely an API call
                new RegExp("^/_"),
                // Exclude any URLs whose last part seems to be a file extension
                // as they're likely a resource and not a SPA route.
                // URLs containing a "?" character won't be blacklisted as they're likely
                // a route with query params (e.g. auth callbacks).
                new RegExp("/[^/?]+\\.[^/]+$"),
              ],
            }),
          ]
        : []),

      new MiniCssExtractPlugin({
        filename: "static/css/[name][contenthash].css",
        chunkFilename: "static/css/[id].css",
      }),

      ...(argv.mode === "production"
        ? []
        : [new webpack.HotModuleReplacementPlugin()]),
    ],

    // Some libraries import Node modules but don't use them in the browser.
    // Tell webpack to provide empty mocks for them so importing them works.
    node: {
      module: "empty",
      dgram: "empty",
      dns: "mock",
      fs: "empty",
      http2: "empty",
      net: "empty",
      tls: "empty",
      child_process: "empty",
    },
  };
};
