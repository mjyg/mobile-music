<template>
  <scroll class="listview" :data="data" ref="listView">
    <ul>
      <li v-for="group of data" class="list-group" :key="group.title" ref="listGroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li v-for="item of group.item" class="list-group-item" :key="item.id">
            <img v-lazy="item.pic" class="avatar"/>
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list-shortcut" @touchstart="onShortcutTouchStart"
         @touchmove.stop.prevent="onShortcutTouchMove">
      <ul>
        <li v-for="(item, index) of shortcutList" :key="index" class="item" :data-index="index">
          {{item}}
        </li>
      </ul>
    </div>
  </scroll>
</template>

<script>
import Scroll from 'base/scroll/scroll'
import {getData} from 'common/js/dom'

const ANCHOR_HEIGHT = 18 // 滚动条上每个元素的高度

export default {
  data() {
    return {
    }
  },
  props: {
    data: {
      type: Array
    }
  },
  components: {
    Scroll
  },
  computed: {
    shortcutList() {
      return this.data.map((group) => {
        return group.title.substr(0, 1) // 返回该元素构成的新数组
      })
    }
  },
  created() {
    this.touch = {} // touch不需要监听变化，不需要和dom绑定，所以不需要写在data里
  },
  methods: {
    onShortcutTouchStart(e) { // 监听触摸开始事件
      let anchorIndex = getData(e.target, 'index') // 获取点击的group序号
      this._scrollTo(anchorIndex) // 滚动条滚动到相应group
      console.log(e)
      let firstTouch = e.touches[0] // Touch对象表示在触控设备上的触摸
      this.touch.y1 = firstTouch.pageY // 触摸开始时的的Y坐标
      console.log(anchorIndex)
      this.touch.index = anchorIndex
    },
    onShortcutTouchMove(e) { // 监听拖动事件
      let firstTouch = e.touches[0]
      this.touch.y2 = firstTouch.pageY // 拖动时的Y坐标
      let groupNum = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0 // 获取拖动的元素个数（|0表示向下取整）
      this._scrollTo(parseInt(this.touch.index) + groupNum) // 滚动条滚动到相应group(字符串和数字相加会出错)
    },
    _scrollTo(index) {
      this.$refs.listView.scrollToElement(this.$refs.listGroup[index], 0)
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
