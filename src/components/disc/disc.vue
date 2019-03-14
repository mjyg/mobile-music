<template>
  <transition name="slide">
    <music-list :title="disc.title" :bgImage="disc.cover" :songs="this.songs"></music-list>
  </transition>
</template>

<script>
import MusicList from 'components/music-list/music-list'
import {mapGetters} from 'vuex'
import {getDiscSongList} from 'api/recommend'
import {ERR_OK} from 'api/config'
import {createSong} from 'common/js/song'

export default {
  data() {
    return {
      songs: []
    }
  },
  components: {
    MusicList
  },
  created() {
    this._getDisSongList()
  },
  computed: {
    ...mapGetters(['disc'])
  },
  methods: {
    _getDisSongList() {
      const self = this
      if (!this.disc.content_id) {
        this.$router.push({
          path: `/recommend`
        })
        return
      }
      getDiscSongList(this.disc.content_id).then((res) => {
        if (res.code === ERR_OK) {
          self._normalizeSong(res.cdlist[0].songlist)
          console.log('recommend song list:', self.songs)
        }
      })
    },
    _normalizeSong(list) {
      for (const item of list) {
        this.songs.push(createSong(item))
      }
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s
  .slide-enter, .slide-leave-to
    transform: translateX(100%)
</style>
