<template>
    <div class="recommend">
      <scroll class="recommend-content" :data="disLists" ref="scroll">
        <div>
          <div class="slider-wrapper" v-if="recommends.length">
            <slider>
              <div v-for="recommend of recommends" :key="recommend.id">
                <a :href="recommend.linkUrl">
                  <img @load="onLoad" :src="recommend.picUrl"/>
                </a>
              </div>
            </slider>
          </div>
          <div class="recommend-list">
            <h1 class="list-title">热门歌单推荐</h1>
            <ul>
              <li v-for="item of disLists" class="item" :key="item.id">
                <div class="icon">
                  <img width="60" height="60" :src="item.picUrl"/>
                </div>
                <div class="text">
                  <h2 class="name">{{item.topTitle}}</h2>
                  <p class="desc">{{item.songList[0].songname}}--{{item.songList[0].singername}}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </scroll>
    </div>
</template>

<script>
import {getRecommend, getDisList} from 'api/recommend'
import {ERR_OK} from 'api/config'
import Slider from 'base/slider/slider'
import Scroll from 'base/scroll/scroll'

export default {
  data() {
    return {
      recommends: [],
      disLists: []
    }
  },
  components: {
    Slider,
    Scroll
  },
  created() {
    this._getRecommend()
    this._getDisList()
  },
  methods: {
    _getRecommend() {
      getRecommend().then(data => {
        if (data.code === ERR_OK) {
          console.log('recommend data:', data.data.slider)
          this.recommends = data.data.slider
        }
      }).catch(err => {
        console.log(err)
      })
    },
    _getDisList() {
      getDisList().then(data => {
        if (data.code === ERR_OK) {
          console.log('disList data:', data.data.topList)
          this.disLists = data.data.topList
        }
      }).catch(err => {
        console.log(err)
      })
    },
    onLoad() {
      if (!this.checkload) {
        this.$refs.scroll.refresh() // 第一张轮播图片加载时，调用scroll的刷新方法
        this.checkload = true
      }
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .recommend
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .recommend-content
      height: 100%
      overflow: hidden
      .slider-wrapper
        position: relative
        width: 100%
        overflow: hidden
      .recommend-list
        .list-title
          height: 65px
          line-height: 65px
          text-align: center
          font-size: $font-size-medium
          color: $color-theme
        .item
          display: flex
          box-sizing: border-box
          align-items: center
          padding: 0 20px 20px 20px
          .icon
            flex: 0 0 60px
            width: 60px
            padding-right: 20px
          .text
            display: flex
            flex-direction: column
            justify-content: center
            flex: 1
            line-height: 20px
            overflow: hidden
            font-size: $font-size-medium
            .name
              margin-bottom: 10px
              color: $color-text
            .desc
              color: $color-text-d
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
