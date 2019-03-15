<template>
    <div ref="wrapper">
      <slot></slot>
    </div>
</template>

<script>
import BetterScroll from 'better-scroll'

export default {
  props: {
    data: {
      type: Array
    },
    click: {
      type: Boolean,
      default: true
    },
    probeType: { // 拖动多大速度监听事件
      type: Number,
      default: 1
    },
    listenScroll: {
      type: Boolean,
      default: false
    },
    pullup: { // 是否支持上拉刷新
      type: Boolean,
      default: false
    }
  },
  mounted() {
    setTimeout(() => {
      this._initScroll()
    }, 20)
  },
  watch: {
    data() { // 数据改变时刷新
      setTimeout(() => {
        this.refresh()
      }, 20)
    }
  },
  methods: {
    _initScroll() {
      if (!this.$refs.wrapper) {
        return
      }
      this.scroll = new BetterScroll(this.$refs.wrapper, {
        click: this.click,
        probeType: this.probeType
      })
      if (this.listenScroll) {
        const self = this
        this.scroll.on('scroll', (pos) => {
          self.$emit('scroll', pos) // 如果需要监听scroll，则往父组件派发一个事件，传递位置参数
        })
      }
      if (this.pullup) {
        this.scroll.on('scrollEnd', () => {
          if (this.scroll.y < (this.scroll.maxScrollY + 50)) { // 快要滚动到底部
            this.$emit('scrollToEnd')
          }
        })
      }
    },
    refresh() {
      this.scroll && this.scroll.refresh()
    },
    scrollTo() {
      this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
    },
    scrollToElement() {
      this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
    }
  }
}
</script>

<style scoped>

</style>
