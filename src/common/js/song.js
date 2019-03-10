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
    url: `http://124.172.114.55/amobile.music.tc.qq.com/C400${musicData.songmid}.m4a?guid=3956452171&vkey=5170A269C1748A93BDE215DC9AD55DABD807D283FC748C3B25F9D7E3E1B30D09EC3AFB4B9A92397CF01D1C7DFD8FC17D3C3C2F356A5A24DC&uin=0&fromtag=66`
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
