const { defineConfig } = require('@vue/cli-service')
const path = require('path')
const resolve = dir => path.join(__dirname, dir)

module.exports = defineConfig({
  //关闭检查
  lintOnSave:false,
  transpileDependencies: true,
  devServer: {
    host: '127.0.0.1',
    port: 8080,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8082',// 请求的api地址
        changeOrigin: true, 
        pathRewrite:{
          '^/api': ''
        }
      }
    }
  },
  configureWebpack: {
    resolve:{
      alias:{
        '@': resolve('src')
      }
    }
  }
})
