import Vue from 'vue'
import App from './App'
import fastclick from 'fastclick'
import router from './router'
import lazyload from 'vue-lazyload'
import store from './store'

import 'common/stylus/index.styl'

fastclick.attach(document.body)

Vue.config.productionTip = false

Vue.use(lazyload, {
  loading: require('common/image/default.png') // 懒加载时使用的图片,页面用v-lazy指令
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
