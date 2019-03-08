// 定义修改状态的操作，更改 Vuex 的 store 中的状态的唯一方法是提交 mutation。

import * as types from './mutation-types'

const mutations = {
  [types.SET_SINGER](state, singer) { // 方法名定义为常量可以检测错误
    state.singer = singer
  }
}

export default mutations
