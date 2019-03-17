<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box ref="searchBox" @query="onQuery"></search-box>
    </div>
    <div class="shortcut-wrapper" v-show="!query">
      <div class="shortcut">
        <div class="hot-key">
          <h1 class="title">热门搜索</h1>
          <ul>
            <li v-for="item of hotKey"  class="item" :key="item.n"
                @click="selectHotKey(item.k)">
              <span>{{item.k}}</span>
            </li>
          </ul>
        </div>
        <div class="search-history">
          <h1 class="title">
            <span class="text">搜索历史</span>
            <span class="clear" @click="clearSearchHistory">
              <i class="icon-clear"></i>
            </span>
          </h1>
          <search-list :searches="searchHistory" @select="selectHistory"
                       @delete="deleteSearchHistory"></search-list>
        </div>
      </div>
    </div>
    <div class="search-result" v-show="query" ref="searchResult">
      <suggest :query="query" @selectSinger="selectSinger" ref="suggest"
               @selectSong="selectSong" @beforeScroll="beforeScroll"></suggest>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import SearchBox from 'base/search-box/search-box'
import {getHotKey} from 'api/search'
import {ERR_OK} from 'api/config'
import Suggest from 'components/suggest/suggest'
import Singer from 'common/js/singer'
import {mapMutations, mapActions, mapGetters} from 'vuex'
import {playlistMixin} from 'common/js/mixin'
import SearchList from 'base/search-list/search-list'

export default {
  data() {
    return {
      hotKey: [],
      query: ''
    }
  },
  mixins: [playlistMixin],
  components: {
    SearchBox,
    Suggest,
    SearchList
  },
  computed: {
    ...mapGetters(['searchHistory'])
  },
  created() {
    this._getHotKey()
    this.insertSearchHistory('')
  },
  methods: {
    ...mapMutations({
      setSinger: 'SET_SINGER'
    }),
    ...mapActions(['insertSong', 'insertSearchHistory', 'deleteSearchHistory',
      'clearSearchHistory']),
    handlePlaylist() {
      this.setStyle(this.$refs.searchResult, this.$refs.suggest)
    },
    selectHistory(query) {
      this.query = query
      this.selectHotKey(query)
    },
    beforeScroll() {
      this.$refs.searchBox.blur()
    },
    selectSong(item) {
      this.insertSong(item)
      this.insertSearchHistory(this.query)
    },
    selectSinger(item) {
      this.$router.push({
        path: `/search/${item.singermid}`
      })
      this.setSinger(new Singer(item.singermid, item.singername))
      this.insertSearchHistory(this.query)
    },
    onQuery(query) {
      this.query = query
    },
    selectHotKey(key) {
      this.$refs.searchBox.setQuery(key)
    },
    _getHotKey() {
      getHotKey().then((res) => {
        if (res.code === ERR_OK) {
          this.hotKey = res.data.hotkey.slice(0, 10)
        }
      })
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .search
    .search-box-wrapper
      margin: 20px
    .shortcut-wrapper
      position: fixed
      top: 178px
      bottom: 0
      width: 100%
      .shortcut
        height: 100%
        overflow: hidden
        .hot-key
          margin: 0 20px 20px 20px
          .title
            margin-bottom: 20px
            font-size: $font-size-medium
            color: $color-text-l
          .item
            display: inline-block
            padding: 5px 10px
            margin: 0 20px 10px 0
            border-radius: 6px
            background: $color-highlight-background
            font-size: $font-size-medium
            color: $color-text-d
        .search-history
          position: relative
          margin: 0 20px
          .title
            display: flex
            align-items: center
            height: 40px
            font-size: $font-size-medium
            color: $color-text-l
            .text
              flex: 1
            .clear
              extend-click()
              .icon-clear
                font-size: $font-size-medium
                color: $color-text-d
    .search-result
      position: fixed
      width: 100%
      top: 178px
      bottom: 0
</style>
