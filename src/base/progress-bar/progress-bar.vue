<template>
  <div class="progress-bar" ref="proBar" @click="clickProgress">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper" ref="proBtn" @touchstart.prevent="touchStart"
           @touchmove.prevent="touchMove" @touchend="touchEnd">
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script>
import {prefixStyle} from 'common/js/dom'

const transform = prefixStyle('transform')
const btnWidth = 16

export default {
  props: {
    percent: {
      types: Number,
      default: 0
    }
  },
  watch: {
    percent(newVal) {
      if (newVal >= 0 && !this.touch.init) {
        this.barWidth = this.$refs.proBar.clientWidth - btnWidth
        this._setMoveStyle(this.barWidth * newVal)
      }
    }
  },
  created() {
    this.touch = {}
  },
  methods: {
    touchStart(e) {
      this.touch.init = true
      this.touch.startX = e.touches[0].pageX
      this.touch.left = this.$refs.progress.clientWidth
    },
    touchMove(e) {
      if (this.touch.init) {
        let moveWidth = e.touches[0].pageX - this.touch.startX
        moveWidth = Math.min(Math.max(0, moveWidth + this.touch.left), this.barWidth)
        this._setMoveStyle(moveWidth)
      }
    },
    touchEnd() {
      this.touch.init = false
      this._emitPercent()
    },
    clickProgress(e) {
      // 点击button的时候获取的offsetX不对
      // this._setMoveStyle(e.offsetX) // offset是相对于带定位的父组件的x的坐标
      const rect = this.$refs.proBar.getBoundingClientRect() // 元素到视口的位置
      const width = e.pageX - rect.left
      this._setMoveStyle(width)
      this._emitPercent()
    },
    _emitPercent() {
      const proWidth = this.$refs.progress.clientWidth
      this.$emit('changeProgress', proWidth / this.barWidth)
    },
    _setMoveStyle(width) {
      this.$refs.progress.style.width = width + 'px'
      this.$refs.proBtn.style[transform] = `translateX(${width}px)`
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .progress-bar
    height: 30px
    .bar-inner
      position: relative
      top: 13px
      height: 4px
      background: rgba(0, 0, 0, 0.3)
      .progress
        position: absolute
        height: 100%
        background: $color-theme
      .progress-btn-wrapper
        position: absolute
        left: -8px
        top: -13px
        width: 30px
        height: 30px
        .progress-btn
          position: relative
          top: 7px
          left: 7px
          box-sizing: border-box
          width: 16px
          height: 16px
          border: 3px solid $color-text
          border-radius: 50%
          background: $color-theme
</style>
