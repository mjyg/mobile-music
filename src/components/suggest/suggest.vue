<template>
  <div class="suggest">
    <ul class="suggest-list">
      <li class="suggest-item" v-for="(item, index) of suggest" :key="index">
        <div class="icon">
          <i :class="setSuggestIcon(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="setSuggestText(item)">}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import {getSuggest} from 'api/search'
import {ERR_OK} from 'api/config'
import {createSong} from 'common/js/song'

const TYPE_SINGER = 'singer'

export default {
  data() {
    return {
      suggest: []
    }
  },
  props: {
    query: {
      type: String,
      default: ''
    }
  },
  watch: {
    query(newVal) {
      this._getSuggest(newVal)
    }
  },
  created() {
  },
  methods: {
    setSuggestText(item) {
      return item.type === TYPE_SINGER ? item.singername : `${item.name}--${item.singer}`
    },
    setSuggestIcon(item) {
      return item.type === TYPE_SINGER ? `icon-mine` : 'icon-music'
    },
    _getSuggest(query) {
      getSuggest(query, 1).then((res) => {
        if (res.code === ERR_OK) {
          this._handleSuggestData(res.data)
        }
      })
    },
    _handleSuggestData(data) {
      this.suggest = []
      if (data.zhida && data.zhida.singername) {
        this.suggest.push({...data.zhida, ...{type: TYPE_SINGER}})
      }
      if (data.song && data.song.list) {
        this._normalSong(data.song.list)
      }
    },
    _normalSong(list) {
      for (const item of list) {
        this.suggest.push(createSong(item))
      }
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 30px
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 20px
      .icon
        flex: 0 0 30px
        width: 30px
        [class^="icon-"]
          font-size: 14px
          color: $color-text-d
      .name
        flex: 1
        font-size: $font-size-medium
        color: $color-text-d
        overflow: hidden
        .text
          no-wrap()
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
