// 定义异步操作和对mutation的封装，
// action 的作用跟mutation的作用是一致的，它提交mutation，从而改变state，是改变state的一个增强版
// 在一个动作中提交多个mutation,可以定义一个action
import * as types from './mutation-types'

export const selectPlay = function ({commit}, {list, index}) {
  commit(types.SET_PLAYLIST, list)
  commit(types.SET_CURRENT_INDEX, index)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
  commit(types.SET_SEQUENCE_LIST, list)
}
