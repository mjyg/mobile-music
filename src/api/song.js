import axios from 'axios'
import {commonParams} from './config'

export function getLyric(mid) {
  const url = '/api/getLyric'

  const data = Object.assign({}, commonParams, {
    songmid: mid,
    platform: 'yqq.json',
    hostUin: 0,
    needNewCode: 0,
    pcachetime: +new Date(),
    format: 'json',
    '-': 'MusicJsonCallback_lrc'
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
