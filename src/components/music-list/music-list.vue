<template>
  <div class="music-list">
    <div class="back" ref="iconBack">
      <i class="icon-back"></i>
    </div>
    <h1 class="title">{{title}}</h1>
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <div class="filter" ref="filter"></div>
    </div>
    <div class="bg-layer" ref="bgLayer"></div>
    <scroll :data="songs" class="list" ref="songsScroll" @scroll="scroll"
            :listenScroll="true" :probeType="3">
      <div class="song-list-wrapper">
        <song-list :songs="songs"></song-list>
      </div>
    </scroll>
  </div>
</template>

<script>
import SongList from 'base/song-list/song-list'
import Scroll from 'base/scroll/scroll'
import {prefixStyle} from 'common/js/dom'

const transform = prefixStyle('transform')
const backdrop = prefixStyle('backdrop-filter')

export default {
  data() {
    return {
    }
  },
  components: {
    SongList,
    Scroll
  },
  props: {
    bgImage: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    songs: {
      type: Array
    }
  },
  computed: {
    bgStyle() {
      return `background-image: url(${this.bgImage})`
    }
  },
  mounted() {
    // songsScroll属于Vue实例，需要用$el获取dom元素，原生的dom元素不需要
    this.iconBackHeight = this.$refs.iconBack.clientHeight
    this.bgImageHeight = this.$refs.bgImage.clientHeight
    // 计算歌曲背景滚动条的最大高度（因为是固定的，只需要计算一次，所以写在mounted里）
    this.maxheight = this.bgImageHeight - this.iconBackHeight
    this.$refs.songsScroll.$el.style.top = `${this.bgImageHeight}px`
  },
  methods: {
    scroll(pos) {
      const posY = pos.y
      const height = Math.max(-this.maxheight, posY)
      let scale = 1
      let blur = 0
      if (posY < -this.maxheight) { // 往上滚动
        this.setBgImageStyle(0, this.iconBackHeight, 10)
      } else {
        this.setBgImageStyle('70%', 0, 0)
      }
      const percent = Math.abs(posY / this.bgImageHeight)
      if (posY > 0) { // 往下滚动
        scale = percent + 1 // 滚动比例
        this.$refs.bgImage.style.zIndex = 10
      } else { // 往上滚动
        blur = Math.min(percent * 20, 20)
      }
      // 往上滚动时图片跟随滚动
      this.$refs.bgLayer.style[transform] = `translate3d(0, ${height}px, 0)`
      this.$refs.bgImage.style[transform] = `scale(${scale})` // 往下滚动时图片放大
      this.$refs.filter.style[backdrop] = `blur(${blur}px)` // 往上滚动时，设置图片高斯模糊
    },
    setBgImageStyle(paddingTop, height, zIndex) {
      const bgImageStyle = this.$refs.bgImage.style
      bgImageStyle.paddingTop = paddingTop
      bgImageStyle.height = `${height}px`
      bgImageStyle.zIndex = zIndex
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .music-list
    position: fixed
    z-index: 100
    top: 0
    left: 0
    bottom: 0
    right: 0
    background: $color-background
    .back
      position absolute
      top: 0
      left: 6px
      z-index: 50
      .icon-back
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-theme
    .title
      position: absolute
      top: 0
      left: 10%
      z-index: 40
      width: 80%
      no-wrap()
      text-align: center
      line-height: 40px
      font-size: $font-size-large
      color: $color-text
    .bg-image
      position: relative
      width: 100%
      height: 0
      padding-top: 70%
      transform-origin: top
      background-size: cover
      .play-wrapper
        position: absolute
        bottom: 20px
        z-index: 50
        width: 100%
        .play
          box-sizing: border-box
          width: 135px
          padding: 7px 0
          margin: 0 auto
          text-align: center
          border: 1px solid $color-theme
          color: $color-theme
          border-radius: 100px
          font-size: 0
          .icon-play
            display: inline-block
            vertical-align: middle
            margin-right: 6px
            font-size: $font-size-medium-x
          .text
            display: inline-block
            vertical-align: middle
            font-size: $font-size-small
      .filter
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        background: rgba(7, 17, 27, 0.4)
    .bg-layer
      position: relative
      height: 100%
      background: $color-background
    .list
      position: fixed
      top: 0
      bottom: 0
      width: 100%
      background: $color-background
      .song-list-wrapper
        padding: 20px 30px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
