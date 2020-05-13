const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = ({ mode }) => ({
  mode,
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ],
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-proposal-class-properties', ['@babel/plugin-proposal-decorators', { decoratorsBeforeExport: true }]]
          }
        }
      }
    ]
  },
  devtool: mode === 'development' ? 'source-map' : 'none'
})
