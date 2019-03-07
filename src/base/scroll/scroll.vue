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
    probeType: {
      type: Number,
      default: 1
    },
    listenScroll: {
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
    },
    refresh() {
      this.scroll && this.scroll.refresh()
    },
    scrollTo() {
      return this.scroll.scrollTo.apply(this.scroll, arguments)
    },
    scrollToElement() {
      return this.scroll.scrollToElement.apply(this.scroll, arguments)
    }
  }
}
</script>

<style scoped>

</style>
