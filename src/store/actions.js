// 定义异步操作和对mutation的封装，
// action 的作用跟mutation的作用是一致的，它提交mutation，从而改变state，是改变state的一个增强版
// 在一个动作中提交多个mutation,可以定义一个action
import * as types from './mutation-types'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/util'
import {saveSearch, deleteSearch, clearSearch} from 'common/js/cache'

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
  const currentSong = playlist[currentIndex]

  // 处理playlist
  currentIndex = handlePlaylist(playlist, song, currentIndex)

  // 处理sequenceList
  handlePlaylist(sequenceList, song, findIndex(sequenceList, currentSong))

  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_PLAYLIST, playlist)
  commit(types.SET_CURRENT_INDEX, currentIndex)
}

export const insertSearchHistory = function({commit}, query) {
  commit(types.SET_SEARCH_HISTORY, saveSearch(query))
}
export const deleteSearchHistory = function({commit}, query) {
  commit(types.SET_SEARCH_HISTORY, deleteSearch(query))
}

export const clearSearchHistory = function({commit}) {
  commit(types.SET_SEARCH_HISTORY, clearSearch())
}

function findIndex(list, song) {
  return list.findIndex((item) => {
    return item.id === song.id
  })
}

function handlePlaylist(playlist, song, currentIndex) {
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
  return currentIndex
}
