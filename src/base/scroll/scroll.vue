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
      })
    },
    refresh() {
      this.scroll && this.scroll.refresh()
    }
  }
}
</script>

<style scoped>

</style>
