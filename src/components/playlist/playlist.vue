<template>
  <transition name="list-fade">
    <div class="playlist" v-show="showFlag" @click="hide">
      <div class="list-wrapper" @click.stop> <!--阻止内部点击冒泡-->
        <div class="list-header">
          <h1 class="title">
            <i class="icon" :class="iconMode" @click="changeMode"></i>
            <span class="text">{{playModeText}}</span>
            <span class="clear" @click="clearPlaylist">
              <i class="icon-clear"></i>
            </span>
          </h1>
        </div>
        <scroll class="list-content" :data="sequenceList" ref="scroll">
          <transition-group tag="ul" name="list">
            <li class="item" :key="item.id" v-for="(item, index) of sequenceList"
                @click="selectItem(item, index)" ref="list">
              <i class="current" :class="getCurrentCls(item)"></i>
              <span class="text" v-html="item.name">}</span>
              <span class="like">
              <i class="icon-not-favorite"></i>
              </span>
              <span class="delete" @click.stop="deleteItem(item)">
                <i class="icon-delete"></i>
              </span>
            </li>
          </transition-group>
        </scroll>
        <div class="list-operate">
          <div class="add" @click="addSong">
            <i class="icon-add"></i>
            <span class="text">添加歌曲到队列</span>
          </div>
        </div>
        <div class="list-close" @click="hide">
          <span>关闭</span>
        </div>
      </div>
      <confirm text="确认清空播放列表？" @confirm="confirm" ref="confirm"></confirm>
      <add-song ref="addSong"></add-song>
    </div>
  </transition>
</template>

<script>
import {mapGetters, mapMutations, mapActions} from 'vuex'
import Scroll from 'base/scroll/scroll'
import {playMode} from 'common/js/config'
import Confirm from 'base/confirm/confirm'
import {playModeMixin} from 'common/js/mixin'
import AddSong from 'components/add-song/add-song'

export default {
  data() {
    return {
      showFlag: false
    }
  },
  mixins: [playModeMixin],
  components: {
    Scroll,
    Confirm,
    AddSong
  },
  computed: {
    ...mapGetters(['sequenceList', 'currentSong', 'mode', 'playlist']),
    playModeText() {
      return this.mode === playMode.random ? '随机播放' : this.mode === playMode.loop
        ? '单曲循环' : '顺序播放'
    }
  },
  watch: {
    currentSong(newVal, oldVal) {
      if (!this.showFlag || newVal.id === oldVal) {
        return
      }
      this._scrollToCurrentSong(newVal)
    }
  },
  methods: {
    ...mapMutations({
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayingState: 'SET_PLAYING_STATE'
    }),
    ...mapActions(['deleteSong', 'clearSong']),
    addSong() {
      this.$refs.addSong.show()
    },
    clearPlaylist() {
      this.$refs.confirm.show()
    },
    confirm() {
      this.clearSong()
      this.showFlag = false
    },
    deleteItem(song) {
      this.deleteSong(song)
      if (!this.playlist.length) {
        this.hide()
      }
    },
    selectItem(song, index) {
      if (this.mode === playMode.random) {
        index = this.playlist.findIndex((item) => {
          return item.id === song.id
        })
      }
      this.setCurrentIndex(index)
      this.setPlayingState(true)
    },
    getCurrentCls(song) {
      return song.id === this.currentSong.id ? 'icon-play' : ''
    },
    show() {
      this.showFlag = true
      setTimeout(() => {
        this.$refs.scroll.refresh()
        this._scrollToCurrentSong(this.currentSong)
      }, 20)
    },
    hide() {
      this.showFlag = false
    },
    _scrollToCurrentSong(song) {
      const index = this.sequenceList.findIndex((item) => {
        return item.id === song.id
      })
      this.$refs.scroll.scrollToElement(this.$refs.list[index], 300)
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .playlist
    position: fixed
    left: 0
    right: 0
    top: 0
    bottom: 0
    z-index: 200
    background-color: $color-background-d
    &.list-fade-enter-active, &.list-fade-leave-active
      transition: opacity 0.3s
      .list-wrapper
        transition: all 0.3s
    &.list-fade-enter, &.list-fade-leave-to
      opacity: 0
      .list-wrapper
        transform: translate3d(0, 100%, 0)
    &.list-fade-enter
    .list-wrapper
      position: absolute
      left: 0
      bottom: 0
      width: 100%
      background-color: $color-highlight-background
      .list-header
        position: relative
        padding: 20px 30px 10px 20px
        .title
          display: flex
          align-items: center
          .icon
            margin-right: 10px
            font-size: 30px
            color: $color-theme-d
          .text
            flex: 1
            font-size: $font-size-medium
            color: $color-text-l
          .clear
            extend-click()
            .icon-clear
              font-size: $font-size-medium
              color: $color-text-d
      .list-content
        max-height: 240px
        overflow: hidden
        .item
          display: flex
          align-items: center
          height: 40px
          padding: 0 30px 0 20px
          overflow: hidden
          &.list-enter-active, &.list-leave-active
            transition: all 0.1s
          &.list-enter, &.list-leave-to
            height: 0
          .current
            flex: 0 0 20px
            width: 20px
            font-size: $font-size-small
            color: $color-theme-d
          .text
            flex: 1
            no-wrap()
            font-size: $font-size-medium
            color: $color-text-d
          .like
            extend-click()
            margin-right: 15px
            font-size: $font-size-small
            color: $color-theme
            .icon-favorite
              color: $color-sub-theme
          .delete
            extend-click()
            font-size: $font-size-small
            color: $color-theme
      .list-operate
        width: 140px
        margin: 20px auto 30px auto
        .add
          display: flex
          align-items: center
          padding: 8px 16px
          border: 1px solid $color-text-l
          border-radius: 100px
          color: $color-text-l
          .icon-add
            margin-right: 5px
            font-size: $font-size-small-s
          .text
            font-size: $font-size-small
      .list-close
        text-align: center
        line-height: 50px
        background: $color-background
        font-size: $font-size-medium-x
        color: $color-text-l
</style>
