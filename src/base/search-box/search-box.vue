<template>
  <div class="search-box">
    <i class="icon-search"></i>
    <input class="box" v-model="query" :placeholder="placeholder" ref="searchInput"/>
    <i v-show="query" class="icon-dismiss" @click="clear"></i>
  </div>
</template>

<script>
import {debounce} from 'common/js/util'

export default {
  data() {
    return {
      query: ''
    }
  },
  props: {
    placeholder: {
      type: String,
      default: '搜索歌曲、歌手'
    }
  },
  created() {
    this.$watch('query', debounce((newVal) => { // 调用节流函数
      this.$emit('query', newVal) // 当query改变时，派发query事件，把query值传递出去
    }, 200))
  },
  methods: {
    clear() {
      this.query = ''
    },
    setQuery(query) { // 外部组件调用此方法修改query
      this.query = query
    },
    blur() {
      this.$refs.searchInput.blur() // 搜索输入框失去焦点，隐藏输入键盘
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .search-box
    display: flex
    align-items: center
    box-sizing: border-box
    width: 100%
    padding: 0 6px
    height: 40px
    background: $color-highlight-background
    border-radius: 6px
    .icon-search
      font-size: 24px
      color: $color-background
    .box
      flex: 1
      margin: 0 5px
      line-height: 18px
      background: $color-highlight-background
      color: $color-text
      font-size: $font-size-medium
      &::placeholder
        color: $color-text-d
    .icon-dismiss
      font-size: 16px
      color: $color-background
</style>
