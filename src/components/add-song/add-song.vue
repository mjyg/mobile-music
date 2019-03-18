<template>
  <transition name="slide">
    <div class="add-song" v-show="showFlag" @click.stop>
      <div class="header">
        <h1 class="title">添加歌曲到列表</h1>
        <div class="close" @click="hide">
          <i class="icon-close"></i>
        </div>
      </div>
      <div class="search-box-wrapper">
        <search-box ref="searchBox" @query="onQuery" placeholder="搜索歌曲"></search-box>
      </div>
      <div class="shortcut" v-show="!query">
        <switches :switches="switches" :currentIndex="switchIndex" @switch="switchItem">
        </switches>
        <div class="list-wrapper">
          <scroll :data="playHistory" v-show="switchIndex === 0" class="list-scroll"
                  ref="playHistory">
            <div class="list-inner">
              <song-list :songs="playHistory" @selectSong="selectSong"></song-list>
            </div>
          </scroll>
          <scroll :data="searchHistory" v-show="switchIndex === 1" class="list-scroll"
                  ref="searchHistory" :refreshDelay="refreshDelay">
            <div class="list-inner">
              <search-list :searches="searchHistory" @select="selectHistory"
                           @delete="deleteSearchHistory">
              </search-list>
            </div>
          </scroll>
        </div>
      </div>
      <div class="search-result" v-show="query" ref="searchResult">
        <suggest :query="query" ref="suggest" @selectSong="selectSong"
                 @beforeScroll="beforeScroll" :showSinger="false">
        </suggest>
      </div>
      <top-tip ref="topTip">
        <div class="tip-title">
          <i class="icon-ok"></i>
          <span class="text">1首歌曲已经添加到播放列表</span>
        </div>
      </top-tip>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import SearchBox from 'base/search-box/search-box'
import {searchMixin} from 'common/js/mixin'
import Suggest from 'components/suggest/suggest'
import Switches from 'base/switches/switches'
import SongList from 'base/song-list/song-list'
import Scroll from 'base/scroll/scroll'
import {mapGetters, mapActions} from 'vuex'
import Song from 'common/js/song'
import SearchList from 'base/search-list/search-list'
import TopTip from 'base/top-tip/top-tip'

export default {
  data() {
    return {
      showFlag: false,
      switches: [{
        name: '最近播放'
      }, {
        name: '搜索历史'
      }],
      switchIndex: 0
    }
  },
  mixins: [searchMixin],
  components: {
    SearchBox,
    Suggest,
    Switches,
    SongList,
    Scroll,
    SearchList,
    TopTip
  },
  computed: {
    ...mapGetters(['playHistory'])
  },
  methods: {
    ...mapActions(['insertPlayHistory', 'insertSong', 'insertSearchHistory']),
    hide() {
      this.showFlag = false
    },
    show() {
      this.showFlag = true
      setTimeout(() => {
        if (this.switchIndex === 0) {
          this.$refs.playHistory.refresh()
        } else {
          this.$refs.searchHistory.refresh()
        }
      }, 20)
    },
    switchItem(index) {
      this.switchIndex = index
    },
    selectSong(song) {
      this.insertSong(new Song(song))
      this.insertPlayHistory(song)
      this.insertSearchHistory(this.query)
      this.showTopTip()
    },
    showTopTip() {
      this.$refs.topTip.show()
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .add-song
    position: fixed
    top: 0
    bottom: 0
    width: 100%
    z-index: 200
    background: $color-background
    &.slide-enter-active, &.slide-leave-active
      transition: all 0.3s
    &.slide-enter, &.slide-leave-to
      transform: translate3d(100%, 0, 0)
    .header
      position: relative
      height: 44px
      text-align: center
      .title
        line-height: 44px
        font-size: $font-size-large
        color: $color-text
      .close
        position: absolute
        top: 0
        right: 8px
        .icon-close
          display: block
          padding: 12px
          font-size: 20px
          color: $color-theme

    .search-box-wrapper
      margin: 20px
    .shortcut
      .list-wrapper
        position: absolute
        top: 165px
        bottom: 0
        width: 100%
        .list-scroll
          height: 100%
          overflow: hidden
          .list-inner
            padding: 20px 30px
    .search-result
      position: fixed
      top: 124px
      bottom: 0
      width: 100%
    .tip-title
      text-align: center
      padding: 18px 0
      font-size: 0
      .icon-ok
        font-size: $font-size-medium
        color: $color-theme
        margin-right: 4px
      .text
        font-size: $font-size-medium
        color: $color-text
</style>
