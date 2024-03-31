const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig( {
  transpileDependencies: true,
  lintOnSave:false,
  devServer: {
    port: 8081,
    proxy: {
      '/api': {
        target: 'http://192.168.195.122:8080/api',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
})
