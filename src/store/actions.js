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
    index = findIndex(newList, list[index])
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

export const insertSong = function({commit, state}, song) {
  const playlist = state.playlist.slice()
  let currentIndex = state.currentIndex
  const sequenceList = state.sequenceList.slice()

  // 处理playlist
  const currentSong = playlist[currentIndex]
  // 查找是否含有待插入的歌曲
  const findIndex1 = findIndex(playlist, song)
  // 插入歌曲
  currentIndex++
  playlist.splice(currentIndex, 0, song)
  // 判断是否有待插入歌曲，有则删除
  if (findIndex1 > -1) {
    if (findIndex1 < currentIndex) {
      playlist.splice(findIndex1, 1)
      currentIndex--
    } else {
      playlist.splice(findIndex1 + 1, 1)
    }
  }

  // 处理sequenceList
  let currentIndex2 = findIndex(sequenceList, currentSong)
  let findIndex2 = findIndex(sequenceList, song)
  currentIndex2++
  sequenceList.splice(currentIndex2, 0, song)
  if (findIndex2 > -1) {
    if (findIndex2 < currentIndex2) {
      sequenceList.splice(findIndex2, 1)
    } else {
      sequenceList.splice(findIndex2 + 1, 1)
    }
  }
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_PLAYLIST, playlist)
  commit(types.SET_CURRENT_INDEX, currentIndex)
}

function findIndex(list, song) {
  return list.findIndex((item) => {
    return item.id === song.id
  })
}
