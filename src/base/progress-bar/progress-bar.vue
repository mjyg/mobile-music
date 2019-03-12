<template>
  <div class="progress-bar" ref="proBar">
    <div class="bar-inner">
      <div class="progress" ref="pro"></div>
      <div class="progress-btn-wrapper" ref="proBtn">
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script>
import {prefixStyle} from 'common/js/dom'

const transform = prefixStyle('transform')

export default {
  props: {
    percent: {
      types: Number,
      default: 0
    }
  },
  watch: {
    percent(newVal) {
      const barWidth = this.$refs.proBar.clientWidth - this.$refs.proBtn.clientWidth
      const width = barWidth * newVal
      this.$refs.pro.style.width = width + 'px'
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
