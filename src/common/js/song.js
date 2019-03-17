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
    url: `http://124.172.114.13/amobile.music.tc.qq.com/C400${musicData.songmid}.m4a?guid=3956452171&vkey=B2A8753A23FF8EB74823954C00EAC6D6514775B83DEA5D64C6FB5FEC830264E2D6AA25806F13A5E8BA40474229FB5DDC6702792F8825CF56&uin=0&fromtag=38`
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
