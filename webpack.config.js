/* eslint-disable @typescript-eslint/no-var-requires */
const { resolve } = require('path');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: './src/main',
  target: 'node',
  externals: {},
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          keep_classnames: true,
          keep_fnames: true,
        },
      }),
    ],
  },
  module: {
    rules: [
      {
        test: /\.node$/,
        loader: 'node-loader',
      },
      {
        test: /\.ts?$/,
        use: {
          loader: 'ts-loader',
          options: { transpileOnly: true },
        },
        exclude: /node_modules/,
      },
    ],
  },
  output: {
    filename: 'main.js',
    path: resolve(__dirname, 'build'),
  },
  resolve: {
    plugins: [
      new TsconfigPathsPlugin({
        configFile: './tsconfig-extra.json',
      }),
    ],
    extensions: ['.js', '.ts', '.json'],
  },
  stats: { errorDetails: true },
  plugins: [new ForkTsCheckerWebpackPlugin({ async: false })],
};
/* eslint-enable @typescript-eslint/no-var-requires */
