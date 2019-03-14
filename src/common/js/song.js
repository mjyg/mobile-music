import {getLyric} from 'api/song'
import {ERR_OK} from 'api/config'
import {Base64} from 'js-base64'

class Song {
  constructor({id, mid, singer, name, album, duration, image, url}) {
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.album = album
    this.duration = duration
    this.image = image
    this.url = url
  }
  getLyric() {
    if (this.lyric) {
      return Promise.resolve(this.lyric)
    }
    return new Promise((resolve, reject) => {
      getLyric(this.mid).then((res) => {
        if (res.code === ERR_OK) {
          this.lyric = Base64.decode(res.lyric)
          resolve(this.lyric)
        } else {
          reject(new Error('no lyric'))
        }
      })
    })
  }
}

// 增加工厂方法创建歌曲类
export function createSong(musicData) {
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    singer: _getSinger(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname,
    duration: musicData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=259200`,
    url: `http://124.172.114.17/amobile.music.tc.qq.com/C400${musicData.songmid}.m4a?guid=3956452171&vkey=3724C2DBA023CF698A544EC27B0F71707E03CA617D6AD91DB21402C16B479DC4CB23D92C89FBAD464897E9D25A4E7E16EDD153F6DFD42203&uin=0&fromtag=66`
  })
}

// 拼接歌手
function _getSinger(list) {
  let singer = []
  if (list) {
    for (const item of list) {
      singer.push(item.name)
    }
  }
  return singer.join('/')
}
