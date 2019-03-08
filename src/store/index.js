// Vuex入口文件
import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import mutations from './mutations'
import {state} from './state'
import * as getters from './getters'
import createLogger from 'vuex/dist/logger' // 通过mutation修改state的时候会在控制台打印修改日志

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({ // export Vuex实例
  actions,
  mutations,
  state,
  getters,
  strict: debug, // 调试时开启严格模式，检测state的修改是否来自mutation
  plugins: debug ? [createLogger()] : []
})
