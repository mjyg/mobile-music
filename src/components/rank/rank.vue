<template>
    <div class="rank" ref="rank">
      <scroll class="toplist" :data="topList" ref="topList">
        <ul>
          <li class="item" v-for="item of topList" :key="item.id" @click="selectRank(item)">
            <div class="icon">
              <img width="100" height="100" v-lazy="item.picUrl"/>
            </div>
            <ul class="songlist">
              <li class="song" v-for="(song, index) of item.songList" :key="index">
                <span>{{index + 1}}</span>
                <span>{{song.singername}}--{{song.songname}}</span>
              </li>
            </ul>
          </li>
        </ul>
        <loading class="loading-container" v-show="!topList.length"></loading>
      </scroll>
      <router-view></router-view>
    </div>
</template>

<script>
import {getRank} from 'api/rank'
import {ERR_OK} from 'api/config'
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import {playlistMixin} from 'common/js/mixin'
import {mapMutations} from 'vuex'
import * as types from 'store/mutation-types'

export default {
  data() {
    return {
      topList: []
    }
  },
  mixins: [playlistMixin],
  components: {
    Scroll,
    Loading
  },
  created() {
    this._getRank()
  },
  methods: {
    ...mapMutations({
      setRank: types.SET_RANK
    }),
    selectRank(item) {
      this.$router.push({
        path: `/rank/${item.id}`
      })
      this.setRank(item)
    },
    handlePlaylist() {
      this.setStyle(this.$refs.rank, this.$refs.topList)
    },
    _getRank() {
      getRank().then((res) => {
        if (res.code === ERR_OK) {
          this.topList = res.data.topList
        }
      })
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .rank
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .toplist
      height: 100%
      overflow: hidden
      .item
        display: flex
        margin: 0 20px
        padding-top: 20px
        height: 100px
        &:last-child
          padding-bottom: 20px
        .icon
          flex: 0 0 100px
          width: 100px
          height: 100px
        .songlist
          flex: 1
          display: flex
          flex-direction: column
          justify-content: center
          padding: 0 20px
          height: 100px
          overflow: hidden
          background: $color-highlight-background
          color: $color-text-d
          font-size: $font-size-small
          .song
            no-wrap()
            line-height: 26px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
