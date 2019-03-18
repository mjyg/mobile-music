import {getLyric} from 'api/song'
import {ERR_OK} from 'api/config'
import {Base64} from 'js-base64'

export default class Song {
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
    url: `http://124.172.114.17/amobile.music.tc.qq.com/C400${musicData.songmid}.m4a?guid=3956452171&vkey=65ED3CEA5F8AF613699AD7DF34CCD92254CFB7A87E12E455097B6036B09194120BAA690E08535CCC9A45951F2A916DD9171481C54CABC5ED&uin=0&fromtag=38`
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
