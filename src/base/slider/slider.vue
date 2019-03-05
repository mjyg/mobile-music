<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot></slot>
    </div>
    <div class="dots">
      <div v-for="(dot, index) of dots" :key="index"
           :class="['dot', {active: index === currentPage}]">
      </div>
    </div>
  </div>
</template>

<script>
import BetterScroll from 'better-scroll'
import {addClass} from 'common/js/dom'

export default {
  data() {
    return {
      dots: [],
      currentPage: 0
    }
  },
  props: {
    loop: {
      type: Boolean, // 是否循环轮播
      default: true
    },
    autoPlay: {
      type: Boolean, // 是否自动轮播
      default: true
    },
    interval: {
      type: Number, // 轮播间隔
      default: 4000
    }
  },
  mounted() {
    setTimeout(() => {
      this._setSliderWith()
      this._initDots()
      this._initSlider()
      if (this.autoPlay) {
        this._play()
      }
    }, 20) // 加延时保证dom成功渲染，浏览器的刷新一般是17毫秒，20毫秒延迟是经验值
    window.addEventListener('resize', () => { // 监听窗口大小改变事件
      if (!this.slider) {
        return
      }
      this._setSliderWith(true) // 重新计算宽度
      this.slider.refresh()
    })
  },
  methods: {
    _setSliderWith(isResize) {
      this.children = this.$refs.sliderGroup.children
      let width = 0
      let sliderWidth = this.$refs.slider.clientWidth
      for (let ch of this.children) {
        addClass(ch, 'slider-item')
        ch.style.width = sliderWidth + 'px'
        width += sliderWidth
      }
      // 如果是循环轮播，要克隆两个dom保证左右循环切换
      if (this.loop && !isResize) {
        width += 2 * sliderWidth
      }
      this.$refs.sliderGroup.style.width = width + 'px'
    },
    _initSlider() {
      this.slider = new BetterScroll(this.$refs.slider, { // 轮播插件
        scrollX: true,
        scrollY: false,
        momentum: false,
        snap: {
          loop: this.loop,
          threshold: 0.3,
          speed: 400
        }
      })
      this.slider.on('scrollEnd', () => { // 每次切换到下一张图片触发此事件
        let pageIndex = this.slider.getCurrentPage().pageX
        this.currentPage = pageIndex
        if (this.autoPlay) {
          clearTimeout(this.timer)
          this._play()
        }
      })
    },
    _initDots() {
      this.dots = new Array(this.children.length)
    },
    _play() {
      this.timer = setTimeout(() => {
        this.slider.next()
      }, this.interval)
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .slider
    min-height: 1px
    .slider-group
      position: relative
      overflow: hidden
      white-space: nowrap
      .slider-item
        float: left
        box-sizing: border-box
        overflow: hidden
        text-align: center
        a
          display: block
          width: 100%
          overflow: hidden
          text-decoration: none
        img
          display: block
          width: 100%
    .dots
      position: absolute
      right: 0
      left: 0
      bottom: 12px
      text-align: center
      font-size: 0
      .dot
        display: inline-block
        margin: 0 4px
        width: 8px
        height: 8px
        border-radius: 50%
        background: $color-text-l
        &.active
          width: 20px
          border-radius: 5px
          background: $color-text-ll
</style>
