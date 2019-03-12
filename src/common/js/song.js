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
    url: `http://124.172.114.17/amobile.music.tc.qq.com/C400${musicData.songmid}.m4a?guid=3956452171&vkey=4927BBD87F7C86DC886CA95C210B7A1E4EC80436A6A117D116023530D9AE686BB531C1F46A4407C7D103232CF878D67DDA0919EA398C1404&uin=0&fromtag=66`
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
