const { merge } = require('webpack-merge')
const singleSpaDefaults = require('webpack-config-single-spa')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const pkg = require('./package.json')
const path = require('path')

module.exports = (webpackConfigEnv, argv) => {
  const orgName = 'gostdoc'
  const defaultConfig = singleSpaDefaults({
    orgName,
    projectName: webpackConfigEnv.isDev ? 'dev-config' : 'serve-config',
    webpackConfigEnv,
    argv,
    disableHtmlGeneration: true,
  })

  return merge(defaultConfig, {
    // modify the webpack config however you'd like to by adding to this object
    plugins: [
      new HtmlWebpackPlugin({
        inject: false,
        template: 'src/index.ejs',
        templateParameters: {
          isDev: webpackConfigEnv && webpackConfigEnv.isDev,
          isServe: webpackConfigEnv && webpackConfigEnv.isServe,
          version: pkg.version,
          orgName,
        },
      }),
    ],

    devServer: {
      client: {
        overlay: false,
      },
      static: [
        {
          directory: path.join(__dirname, 'dist'),
          publicPath: '/dist',
        },
        {
          directory: path.join(__dirname, './dist/assets'),
          publicPath: '/assets',
        },
      ],
    },
  })
}
