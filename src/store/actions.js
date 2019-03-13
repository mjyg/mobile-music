// 定义异步操作和对mutation的封装，
// action 的作用跟mutation的作用是一致的，它提交mutation，从而改变state，是改变state的一个增强版
// 在一个动作中提交多个mutation,可以定义一个action
import * as types from './mutation-types'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/util'

export const selectPlay = function({commit, state}, {list, index}) {
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
  commit(types.SET_SEQUENCE_LIST, list)
  let newList = list.slice()
  if (state.mode === playMode.random) {
    newList = shuffle(list)
    index = newList.findIndex((item) => {
      return item.id === list[index].id
    })
  }
  commit(types.SET_PLAYLIST, newList)
  commit(types.SET_CURRENT_INDEX, index)
}

export const randomPlay = function({commit}, {list}) {
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
  commit(types.SET_SEQUENCE_LIST, list)
  commit(types.SET_PLAYLIST, shuffle(list))
  commit(types.SET_PLAY_MODE, playMode.random)
  commit(types.SET_CURRENT_INDEX, 0)
}
