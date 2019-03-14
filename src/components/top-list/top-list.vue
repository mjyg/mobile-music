<template>
  <transition name="slide">
    <music-list :title="rank.topTitle" :bgImage="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script>
import MusicList from 'components/music-list/music-list'
import {mapGetters} from 'vuex'
import {getTopList} from 'api/rank'
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
  computed: {
    ...mapGetters(['rank']),
    bgImage() {
      if (this.songs.length) {
        return this.songs[0].image
      }
      return this.rank.picUrl
    }
  },
  created() {
    this._getTopList()
  },
  methods: {
    _getTopList() {
      if (!this.rank.id) {
        this.$router.push({
          path: '/rank'
        })
        return
      }
      getTopList(this.rank.id).then((res) => {
        if (res.code === ERR_OK) {
          this._normalizeSong(res.songlist)
        }
      })
    },
    _normalizeSong(list) {
      for (const item of list) {
        this.songs.push(createSong(item.data))
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
