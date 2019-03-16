<template>
  <scroll class="suggest" :data="suggest" @scrollToEnd="onScrollToEnd"
          :pullup="true" ref="suggest" @beforeScroll="beforeScroll" :beforeScroll="true">
    <ul class="suggest-list">
      <li class="suggest-item" v-for="(item, index) of suggest" :key="index"
          @click="selectSuggest(item)">
        <div class="icon">
          <i :class="setSuggestIcon(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="setSuggestText(item)">}}</p>
        </div>
      </li>
      <loading v-show="hasMore" title=""></loading>
    </ul>
    <div no-result-wrapper>
      <no-result title="抱歉，暂无搜索结果" v-show="!hasMore &&!suggest.length"></no-result>
    </div>
  </scroll>
</template>

<script>
import {getSuggest} from 'api/search'
import {ERR_OK} from 'api/config'
import {createSong} from 'common/js/song'
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import NoResult from 'base/no-result/no-result'

const TYPE_SINGER = 'singer'
const perpage = 20

export default {
  data() {
    return {
      suggest: [],
      hasMore: true
    }
  },
  components: {
    Scroll,
    Loading,
    NoResult
  },
  props: {
    query: {
      type: String,
      default: ''
    }
  },
  watch: {
    query() {
      this._search()
    }
  },
  methods: {
    beforeScroll() {
      this.$emit('beforeScroll')
    },
    refresh() {
      this.$refs.suggest.refresh()
    },
    selectSuggest(item) {
      if (item.type === TYPE_SINGER) {
        this.$emit('selectSinger', item)
      } else {
        this.$emit('selectSong', item)
      }
    },
    onScrollToEnd() {
      this._searchMore()
    },
    setSuggestText(item) {
      return item.type === TYPE_SINGER ? item.singername : `${item.name}--${item.singer}`
    },
    setSuggestIcon(item) {
      return item.type === TYPE_SINGER ? 'icon-mine' : 'icon-music'
    },
    _search() {
      this.firstSearch = true
      this.suggest = []
      this.hasMore = true
      this.page = 0
      this._getSuggest()
    },
    _searchMore() {
      if (!this.hasMore) {
        return
      }
      this.firstSearch = false
      this.page += 1
      this._getSuggest()
    },
    _getSuggest() {
      getSuggest(this.query, this.page, perpage).then((res) => {
        if (res.code === ERR_OK) {
          this._handleSuggestData(res.data)
          this._checkHasMore(res.data.song)
        }
      })
    },
    _checkHasMore(data) {
      if (!data.list.length ||
        (data.curpage - 1) * perpage + data.curnum >= data.totalnum) {
        this.hasMore = false
      }
    },
    _handleSuggestData(data) {
      if (this.firstSearch && data.zhida && data.zhida.singerid) {
        this.suggest.push({...data.zhida, ...{type: TYPE_SINGER}})
      }
      this._normalSong(data.song.list)
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
