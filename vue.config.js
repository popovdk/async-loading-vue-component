module.exports = {
  configureWebpack: (config) => {
    if (process.env.NODE_ENV !== 'production') {
      config.devtool = 'source-map'
    }
  },
  productionSourceMap: process.env.NODE_ENV !== 'production',
  publicPath: process.env.VUE_PUBLIC_PATH || '/'
}
