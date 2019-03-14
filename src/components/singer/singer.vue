<template>
  <div class="singer" ref="singer">
    <list-view :data="singerList" @clickItem="clickItem" ref="list"></list-view>
    <router-view></router-view>
  </div>
</template>

<script>
import {getSingerList} from 'api/singer'
import {ERR_OK} from 'api/config'
import pinyin from 'pinyin' // 汉字转拼音插件
import Singer from 'common/js/singer'
import ListView from 'base/list-view/list-view'
import {mapMutations} from 'vuex'
import * as types from 'store/mutation-types'
import {playlistMixin} from 'common/js/mixin'

const HOT = '热门'
const HOT_NUM = 10 // 前10为热门歌手

export default {
  data() {
    return {
      singerList: []
    }
  },
  mixins: [playlistMixin],
  components: {
    ListView
  },
  created() {
    this._getSingerList()
  },
  methods: {
    ...mapMutations({ // mapMutations返回的是一个对象，使用扩展运算符可以把此对象混入到外部对象中
      setSinger: types.SET_SINGER
    }),
    handlePlaylist() {
      this.setStyle(this.$refs.singer, this.$refs.list) // 调用混入对象playlistMixin里的方法
    },
    clickItem(singer) {
      this.$router.push({
        path: `/singer/${singer.id}`
      })
      this.setSinger(singer) // 相当于this.$store.commit(types.SET_SINGER, singer)
    },
    _getSingerList() {
      getSingerList().then((res) => {
        if (res.code === ERR_OK) {
          const re = res.singerList.data.singerlist
          console.log('singer list:', re)
          this._normalizeSinger(re)
          this.singerList = this._normalizeSinger(re)
          console.log('normalize singer list:', this.singerList)
        }
      })
    },
    _normalizeSinger(list) { // 处理歌手数据
      let map = {
        [HOT]: {
          title: HOT,
          item: []
        }
      }
      for (let [index, data] of list.entries()) {
        if (index < HOT_NUM) {
          map[HOT].item.push(new Singer(data.singer_mid, data.singer_name, data.singer_pic)) // 抽象出Singer类
        }
      }
      for (let data of list) {
        const name = data.singer_name
        const cap = this._getFirstCapLetter(name)
        if (!map[cap]) {
          map[cap] = {
            title: cap,
            item: [new Singer(data.singer_mid, name, data.singer_pic)]
          }
        } else {
          map[cap].item.push(new Singer(data.singer_mid, name, data.singer_pic))
        }
      }
      // 处理map为有序列表
      let hot = []
      let letter = []
      for (const key of Object.keys(map)) {
        if (/^[a-zA-z]$/.test(key)) {
          letter.push(map[key])
        } else if (key === HOT) {
          hot.push(map[key])
        }
      }
      letter.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0)
      })
      return hot.concat(letter)
    },
    _getFirstCapLetter(name) {
      return pinyin(name, {
        style: pinyin.STYLE_FIRST_LETTER // 返回首字母
      })[0][0].toUpperCase()
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .singer
    position: fixed
    top: 88px
    bottom: 0
    width: 100%
</style>
