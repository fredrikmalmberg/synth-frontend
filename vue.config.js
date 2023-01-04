/*const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,

  pluginOptions: {
    vuetify: {
			// https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vuetify-loader
		}
  },
  devServer: {
    proxy: {
      "^/get": {
      target: 'http://httpbin.org', //http://192.168.1.143:5000/',
      ws: true,
      changeOrigin: true,
      logLevel: 'debug' 
      }
    }
  }
})*/

module.exports = {
  
  /*devServer: {
    proxy: {
      '/*': {
        target: "http://192.168.1.143:5000/",
        logLevel: 'debug',
        ws: false,
        changeOrigin: true
      }
    }
  },*/
  pluginOptions: {
    /*vuetify: {
			// https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vuetify-loader
		}*/
  },
}