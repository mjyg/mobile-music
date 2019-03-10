<template>
    <div>
      <music-list :title="singer.name" :bgImage="singer.pic" :songs="songs"></music-list>
    </div>
</template>

<script>
import {mapGetters} from 'vuex'
import {getSingerDetail} from 'api/singer'
import {ERR_OK} from 'api/config'
import {createSong} from 'common/js/song'
import musicList from 'components/music-list/music-list'

export default {
  data() {
    return {
      songs: []
    }
  },
  components: {
    musicList
  },
  computed: {
    ...mapGetters(['singer']) // 相当于this.$store.state.singer
  },
  created() {
    this._getDetail()
  },
  methods: {
    _getDetail() {
      if (!this.singer.id) {
        this.$router.push({path: '/singer'})
      }
      getSingerDetail(this.singer.id).then((res) => {
        if (res.code === ERR_OK) {
          this._normalizeSong(res.data.list)
          console.log('song list:', this.songs)
        }
      })
    },
    _normalizeSong(list) {
      for (const item of list) {
        let {musicData} = item
        this.songs.push(createSong(musicData))
      }
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
</style>
