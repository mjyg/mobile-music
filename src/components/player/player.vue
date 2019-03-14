<template>
  <div class="player" v-show="playlist.length > 0">
    <transition name="normal" @enter="enter" @after-enter="afterEnter"
                @leave="leave" @after-leave="afterLeave">
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img width="100%" height="100%">
        </div>
        <div class="top" @click="back">
          <div class="back">
            <i class="icon-back"></i>
          </div>
          <h1 class="title">{{currentSong.name}}</h1>
          <h2 class="subtitle">{{currentSong.singer}}</h2>
        </div>
        <div class="middle" @touchstart.prevent="touchStart" @touchmove.prevent="touchMove"
             @touchend.prevent="touchEnd">
          <div class="middle-l" ref="cdSpan">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" :class="cdClass">
                <img class="image" :src="currentSong.image">
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{currentLyricTxt}}</div>
            </div>
          </div>
          <scroll class="middle-r" ref="lyricList"
                  :data="currentLyric && currentLyric.lines">
            <div class="lyric-wrapper">
              <div v-if="currentLyric">
                <p ref="lyricLine" :class="['text', {current: currentLyricLine === index}]"
                   v-for="(line, index) of currentLyric.lines" :key="index">
                  {{line.txt}}
                </p>
              </div>
            </div>
          </scroll>
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <span :class="['dot', {active: currentShow === 'cd'}]"></span>
            <span :class="['dot', {active: currentShow !== 'cd'}]"></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{formatTime(this.currentTime)}}</span>
            <div class="progress-bar-wrapper">
              <progress-bar :percent="percent"
                            @changeProgress="changeProgress">

              </progress-bar>
            </div>
            <span class="time time-r">{{formatTime(this.currentSong.duration)}}</span>
          </div>
          <div class="operators">
            <div class="icon i-left" @click="changeMode">
              <i :class="iconMode"></i>
            </div>
            <div class="icon i-left">
              <i class="icon-prev"  @click="previous"></i>
            </div>
            <div class="icon i-center" :class="disabledCls">
              <i @click="clickPlay" :class="playIcon"></i>
            </div>
            <div class="icon i-right">
              <i class="icon-next" @click="next"></i>
            </div>
            <div class="icon i-right">
              <i class="icon icon-not-favorite"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="open">
        <div class="icon">
          <img width="40" height="40" :src="currentSong.image" :class="cdClass">
        </div>
        <div class="text">
          <h2 class="name">{{currentSong.name}}</h2>
          <p class="desc">{{currentSong.singer}}</p>
        </div>
        <div class="control">
          <progress-circle :radius="32" :percent="percent">
            <i @click.stop="clickPlay" :class="miniPlayIcon" class="icon-mini"></i>
          </progress-circle>
        </div>
        <div class="control">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <audio :src="currentSong.url" ref="audio" @canplay="readyPlay" @error="error"
           @timeupdate="updateTime" @ended="end"></audio>
  </div>
</template>

<script>
import {mapGetters, mapMutations} from 'vuex'
import * as types from 'store/mutation-types'
import animations from 'create-keyframe-animation'
import {prefixStyle} from 'common/js/dom'
import ProgressBar from 'base/progress-bar/progress-bar'
import ProgressCircle from 'base/progress-circle/progress-circle'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/util'
import LyricParse from 'lyric-parser'
import Scroll from 'base/scroll/scroll'

const transform = prefixStyle('transform')
const transitionDuration = prefixStyle('transitionDuration')

export default {
  data() {
    return {
      readyPlayFlag: false,
      currentTime: 0,
      currentLyric: null,
      currentLyricLine: 0,
      currentShow: 'cd',
      currentLyricTxt: '未获取到歌词'
    }
  },
  components: {
    ProgressBar,
    ProgressCircle,
    Scroll
  },
  computed: {
    ...mapGetters(['fullScreen', 'playlist', 'currentSong', 'playing', 'currentIndex',
      'playlist', 'mode', 'sequenceList']),
    playIcon() {
      return this.playing ? 'icon-play' : 'icon-pause'
    },
    miniPlayIcon() {
      return this.playing ? 'icon-play-mini' : 'icon-pause-mini'
    },
    cdClass() {
      return this.playing ? 'play' : 'play pause'
    },
    disabledCls() {
      return this.readyPlayFlag ? '' : 'disable'
    },
    percent() {
      return this.currentTime / this.currentSong.duration
    },
    iconMode() {
      return this.mode === playMode.sequence ? 'icon-sequence'
        : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
    }
  },
  watch: {
    currentSong(newVal, oldVal) {
      if (this.currentLyric) {
        this.currentLyric.seek(0)
        this.currentLyric.stop()
      }
      if (newVal.id === oldVal.id) {
        return
      }
      this.currentLyricTxt = ''
      const self = this
      setTimeout(() => {
        self.$refs.audio.play()
        this.currentLyric = this._getLyric()
      }, 1000) // 保证手机从后台切到前台重新播放歌曲
    },
    playing(newVal) {
      const audio = this.$refs.audio
      this.$nextTick(() => {
        newVal ? audio.play() : audio.pause()
      })
    }
  },
  created() {
    this.touch = {}
  },
  methods: {
    ...mapMutations({
      setFullScreen: types.SET_FULL_SCREEN,
      setPlayingState: types.SET_PLAYING_STATE,
      setCurrentIndex: types.SET_CURRENT_INDEX,
      setMode: types.SET_PLAY_MODE,
      setPlaylist: types.SET_PLAYLIST
    }),
    touchStart(e) {
      this.touch.init = true
      const touch = e.touches[0]
      this.touch.startX = touch.pageX
      this.touch.startY = touch.pageY
    },
    touchMove(e) {
      if (this.touch.init) {
        const touch = e.touches[0]
        const moveX = touch.pageX - this.touch.startX
        const moveY = touch.pageY - this.touch.startY
        if (Math.abs(moveX) < Math.abs(moveY)) { // 纵坐标偏移大于横坐标，不应该左右滑动
          return
        }
        const left = this.currentShow === 'cd' ? 0 : -window.innerWidth
        const offsetWidth = Math.max(Math.min(0, left + moveX), -window.innerWidth)
        this.touch.percent = Math.abs(offsetWidth / window.innerWidth)
        this._setMoveStyle(offsetWidth, 0, 1 - this.touch.percent)
      }
    },
    touchEnd() {
      this.touch.init = false
      const percent = this.touch.percent
      let offsetWidth = 0
      let opacity = 1
      if (this.currentShow === 'cd') {
        if (percent > 0.1) { // 从右向左滑，滑动距离超过10%，则滑动到歌词页面
          this.currentShow = 'lyric'
          offsetWidth = -window.innerWidth
          opacity = 0
        } else {
          offsetWidth = 0
          opacity = 1
        }
      } else {
        if (percent < 0.9 && percent > 0) { // 从左向右滑
          this.currentShow = 'cd'
          offsetWidth = 0
          opacity = 1
        } else {
          offsetWidth = -window.innerWidth
          opacity = 0
        }
      }
      this._setMoveStyle(offsetWidth, '0.3s', opacity)
      this.touch.percent = -1
    },
    _setMoveStyle(offsetWidth, duration, opacity) {
      this.$refs.lyricList.$el.style[transform] = `translateX(${offsetWidth}px)`
      this.$refs.lyricList.$el.style[transitionDuration] = duration
      this.$refs.cdSpan.style.opacity = opacity
      this.$refs.cdSpan.style[transitionDuration] = duration
    },
    end() {
      if (this.mode === playMode.loop) {
        this.loop()
      } else {
        this.next()
      }
    },
    loop() {
      this.$refs.audio.currentTime = 0
      this.$refs.audio.play()
      this.setPlayingState(true)
      if (this.currentLyric) {
        this.currentLyric.seek(0)
      }
    },
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
    },
    changeProgress(percent) {
      const time = percent * this.currentSong.duration
      this.$refs.audio.currentTime = time
      if (!this.playing) {
        this.clickPlay(time)
      }
      this.currentLyric.seek(time * 1000)
    },
    updateTime(e) {
      this.currentTime = e.target.currentTime
    },
    error() {
      this.readyPlayFlag = false // 歌曲加载失败时使按钮可用
      this.currentLyricTxt = '播放出错'
      this.currentLyric = null
      this.setPlayingState(false)
    },
    readyPlay() {
      this.readyPlayFlag = true // 歌曲已准备好，避免快速点击dom出错
    },
    next() {
      this.readyPlayFlag = true
      if (this.playlist.length === 1) { // 歌曲列表只有一首歌时，currentIndex不会改变，用lopp方法播放
        this.loop()
      } else {
        let index = this.currentIndex + 1
        if (index === this.playlist.length) {
          index = 0 // 循环顺序播放
        }
        this.setCurrentIndex(index)
        if (!this.playing) {
          this.clickPlay()
        }
        this.readyPlayFlag = false
      }
    },
    previous() {
      this.readyPlayFlag = true
      if (this.playlist.length === 1) { // 歌曲列表只有一首歌时，currentIndex不会改变，用lopp方法播放
        this.loop()
      } else {
        let index = this.currentIndex - 1
        if (index === -1) {
          index = this.playlist.length - 1// 循环顺序播放
        }
        this.setCurrentIndex(index)
        if (!this.playing) {
          this.clickPlay()
        }
        this.readyPlayFlag = false
      }
    },
    clickPlay() {
      if (this.readyPlayFlag) {
        this.setPlayingState(!this.playing)
        if (this.currentLyric) {
          this.currentLyric.togglePlay()
        }
      } else {
        this.currentLyric.stop()
      }
    },
    back() {
      this.setFullScreen(false)
    },
    open() {
      this.setFullScreen(true)
    },
    enter(el, done) {
      const {x, y, scale} = this._getPosAndScale()
      const animation = {
        0: {
          transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
        },
        60: {
          transform: `translate3d(0,0,0);scale(1.1)`
        },
        100: {
          transform: `translate3d(0,0,0);scale(1)`
        }
      }
      animations.registerAnimation({
        name: 'move',
        animation,
        presets: {
          duration: 400,
          easing: 'Linear'
        }
      })
      animations.runAnimation(this.$refs.cdWrapper, 'move', done)
    },
    afterEnter() {
      animations.unregisterAnimation('move')
      this.$refs.cdWrapper.style.animation = ''
    },
    leave(el, done) {
      this.$refs.cdWrapper.style.transition = 'all 0.4s'
      const {x, y, scale} = this._getPosAndScale()
      this.$refs.cdWrapper.style[transform] = `translate3d(${x}px,${y}px,0) scale(${scale})`
      this.$refs.cdWrapper.addEventListener('transitionend', done)
    },
    afterLeave() {
      this.$refs.cdWrapper.style.transition = ''
      this.$refs.cdWrapper.style[transform] = ''
    },
    _getPosAndScale() { // 获取图片变化位置和比例
      const normalPaddingTop = 80
      const normalWidth = window.innerWidth * 0.8
      const miniLeft = 40
      const miniBottom = 30
      const miniWidth = 40
      const scale = miniWidth / normalWidth
      const x = -(window.innerWidth / 2 - miniLeft)
      const y = window.innerHeight - normalPaddingTop - normalWidth / 2 - miniBottom
      return {x, y, scale}
    },
    formatTime(time) {
      const min = time / 60 | 0
      const sec = this._pad(time % 60 | 0)
      return `${min}:${sec}`
    },
    _pad(num, count = 2) { // 补全0
      let len = num.toString().length
      while (len < count) {
        num = '0' + num
        len++
      }
      return num
    },
    _getLyric() {
      this.currentSong.getLyric().then((lyric) => {
        this.currentLyric = new LyricParse(lyric, this._handleLyric)
        if (this.playing && this.readyPlayFlag) {
          this.currentLyric.play()
        }
      }).catch(() => {
        this.currentLyric = null
        this.currentLyricLine = 0
        this.currentLyricTxt = ''
      })
    },
    _handleLyric({lineNum, txt}) {
      this.currentLyricLine = lineNum
      if (lineNum > 5) {
        const currentLyricEl = this.$refs.lyricLine[lineNum - 5]
        this.$refs.lyricList.scrollToElement(currentLyricEl, 1000)
      } else {
        this.$refs.lyricList.scrollTo(0, 0, 1000)
      }
      this.currentLyricTxt = this.readyPlayFlag ? txt : '播放出错'
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .player
    .normal-player
      position: fixed
      left: 0
      right: 0
      top: 0
      bottom: 0
      z-index: 150
      background: $color-background
      .background
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        z-index: -1
        opacity: 0.6
        filter: blur(20px)
      .top
        position: relative
        margin-bottom: 25px
        .back
          position absolute
          top: 0
          left: 6px
          z-index: 50
          .icon-back
            display: block
            padding: 9px
            font-size: $font-size-large-x
            color: $color-theme
            transform: rotate(-90deg)
        .title
          width: 70%
          margin: 0 auto
          line-height: 40px
          text-align: center
          no-wrap()
          font-size: $font-size-large
          color: $color-text
        .subtitle
          line-height: 20px
          text-align: center
          font-size: $font-size-medium
          color: $color-text
      .middle
        position: fixed
        width: 100%
        top: 80px
        bottom: 170px
        white-space: nowrap
        font-size: 0
        .middle-l
          display: inline-block
          vertical-align: top
          position: relative
          width: 100%
          height: 0
          padding-top: 80%
          .cd-wrapper
            position: absolute
            left: 10%
            top: 0
            width: 80%
            height: 100%
            .cd
              width: 100%
              height: 100%
              box-sizing: border-box
              border: 10px solid rgba(255, 255, 255, 0.1)
              border-radius: 50%
              &.play
                animation: rotate 20s linear infinite
              &.pause
                animation-play-state: paused
              .image
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                border-radius: 50%

          .playing-lyric-wrapper
            width: 80%
            margin: 30px auto 0 auto
            overflow: hidden
            text-align: center
            .playing-lyric
              height: 20px
              line-height: 20px
              font-size: $font-size-medium
              color: $color-text-l
        .middle-r
          display: inline-block
          vertical-align: top
          width: 100%
          height: 100%
          overflow: hidden
          .lyric-wrapper
            width: 80%
            margin: 0 auto
            overflow: hidden
            text-align: center
            .text
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium
              &.current
                color: $color-text
      .bottom
        position: absolute
        bottom: 50px
        width: 100%
        .dot-wrapper
          text-align: center
          font-size: 0
          .dot
            display: inline-block
            vertical-align: middle
            margin: 0 4px
            width: 8px
            height: 8px
            border-radius: 50%
            background: $color-text-l
            &.active
              width: 20px
              border-radius: 5px
              background: $color-text-ll
        .progress-wrapper
          display: flex
          align-items: center
          width: 80%
          margin: 0px auto
          padding: 10px 0
          .time
            color: $color-text
            font-size: $font-size-small
            flex: 0 0 30px
            line-height: 30px
            width: 30px
            &.time-l
              text-align: left
            &.time-r
              text-align: right
          .progress-bar-wrapper
            flex: 1
        .operators
          display: flex
          align-items: center
          .icon
            flex: 1
            color: $color-theme
            &.disable
              color: $color-theme-d
            i
              font-size: 30px
          .i-left
            text-align: right
          .i-center
            padding: 0 20px
            text-align: center
            i
              font-size: 40px
          .i-right
            text-align: left
          .icon-favorite
            color: $color-sub-theme
      &.normal-enter-active, &.normal-leave-active
        transition: all 0.4s
        .top, .bottom
          transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
      &.normal-enter, &.normal-leave-to
        opacity: 0
        .top
          transform: translate3d(0, -100px, 0)
        .bottom
          transform: translate3d(0, 100px, 0)
    .mini-player
      display: flex
      align-items: center
      position: fixed
      left: 0
      bottom: 0
      z-index: 180
      width: 100%
      height: 60px
      background: $color-highlight-background
      &.mini-enter-active, &.mini-leave-active
        transition: all 0.4s
      &.mini-enter, &.mini-leave-to
        opacity: 0
      .icon
        flex: 0 0 40px
        width: 40px
        padding: 0 10px 0 20px
        img
          border-radius: 50%
          &.play
            animation: rotate 10s linear infinite
          &.pause
            animation-play-state: paused
      .text
        display: flex
        flex-direction: column
        justify-content: center
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          margin-bottom: 2px
          no-wrap()
          font-size: $font-size-medium
          color: $color-text
        .desc
          no-wrap()
          font-size: $font-size-small
          color: $color-text-d
      .control
        flex: 0 0 30px
        width: 30px
        padding: 0 10px
        .icon-play-mini, .icon-pause-mini, .icon-playlist
          font-size: 30px
          color: $color-theme-d
        .icon-mini
          font-size: 32px
          position: absolute
          left: 0
          top: 0

  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
</style>
