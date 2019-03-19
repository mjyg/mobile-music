<template>
    <div class="recommend" ref="recommend">
      <scroll class="recommend-content" :data="disLists" ref="scroll">
        <div>
          <div class="slider-wrapper" v-if="recommends.length">
            <slider>
              <div v-for="recommend of recommends" :key="recommend.id">
                <a>
                  <img @load="onLoad" :src="recommend.picUrl"/>
                </a>
              </div>
            </slider>
          </div>
          <div class="recommend-list">
            <h1 class="list-title">热门歌单推荐</h1>
            <ul>
              <li v-for="item of disLists" class="item" :key="item.content_id"
                  @click="selectDis(item)">
                <div class="icon">
                  <img width="60" height="60" v-lazy="item.cover"/>
                </div>
                <div class="text">
                  <h2 class="desc">{{item.title}}</h2>
                  <p class="desc">—— {{item.username}}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div class="loading-container" v-show="!disLists.length"></div>
        <loading ></loading>
      </scroll>
      <router-view></router-view>
    </div>
</template>

<script>
import {getRecommend, getDisList} from 'api/recommend'
import {ERR_OK} from 'api/config'
import Slider from 'base/slider/slider'
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import {playlistMixin} from 'common/js/mixin'
import {mapMutations} from 'vuex'
import * as types from 'store/mutation-types'

export default {
  data() {
    return {
      recommends: [],
      disLists: []
    }
  },
  mixins: [playlistMixin],
  components: {
    Slider,
    Scroll,
    Loading
  },
  created() {
    this._getRecommend()
    this._getDisList()
  },
  methods: {
    ...mapMutations({
      setDisc: types.SET_DISC
    }),
    handlePlaylist() {
      this.setStyle(this.$refs.recommend, this.$refs.scroll) // 调用混入对象playlistMixin里的方法
    },
    selectDis(item) {
      this.$router.push({
        path: `/recommend/${item.content_id}`
      })
      this.setDisc(item)
    },
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
          const re = data.recomPlaylist.data.v_hot
          console.log('disList data:', re)
          this.disLists = re
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
