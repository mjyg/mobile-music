// 混入对象：当多个组件需要写相同逻辑时，可以把相同逻辑抽象出来放入mixin中,再在组件中插入mixin

import {mapGetters, mapMutations, mapActions} from 'vuex'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/util'
import * as types from 'store/mutation-types'

export const playlistMixin = {
  computed: {
    ...mapGetters(['playlist'])
  },
  watch: {
    playlist() {
      this.handlePlaylist()
    }
  },
  methods: {
    handlePlaylist() {
      throw new Error('component must implement handlePlaylist method')
    },
    setStyle(el, scroll = el) {
      if (this.playlist.length) {
        el.style.bottom = '60px'
        scroll.refresh()
      }
    }
  }
}

export const playModeMixin = {
  computed: {
    ...mapGetters(['mode', 'sequenceList']),
    iconMode() {
      return this.mode === playMode.sequence ? 'icon-sequence'
        : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
    }
  },
  methods: {
    ...mapMutations({
      setCurrentIndex: types.SET_CURRENT_INDEX,
      setMode: types.SET_PLAY_MODE,
      setPlaylist: types.SET_PLAYLIST
    }),
    changeMode() {
      const mode = (this.mode + 1) % 3
      this.setMode(mode)
      let list = []
      if (mode === playMode.random) {
        list = shuffle(this.sequenceList)
      } else {
        list = this.sequenceList
      }
      this._resetCurrentIndex(list)
      this.setPlaylist(list)
    },
    _resetCurrentIndex(list) {
      const self = this
      const index = list.findIndex((item) => {
        return item.id === self.currentSong.id
      })
      this.setCurrentIndex(index)
    }
  }
}

export const searchMixin = {
  data() {
    return {
      query: '',
      refreshDelay: 100
    }
  },
  computed: {
    ...mapGetters(['searchHistory'])
  },
  methods: {
    ...mapActions(['insertSong', 'insertSearchHistory', 'deleteSearchHistory']),
    onQuery(query) {
      this.query = query
    },
    beforeScroll() {
      this.$refs.searchBox.blur()
    },
    selectSong(item) {
      this.insertSong(item)
      this.insertSearchHistory(this.query)
    },
    selectHistory(query) {
      this.query = query
      this.$refs.searchBox.setQuery(query)
    }
  }
}
