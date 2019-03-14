// 混入对象：当多个组件需要写相同逻辑时，可以把相同逻辑抽象出来放入mixin中,再在组件中插入mixin

import {mapGetters} from 'vuex'
export const playlistMixin = {
  computed: {
    ...mapGetters(['playlist'])
  },
  watch: {
    playlist(newVal) {
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
