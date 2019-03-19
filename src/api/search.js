import axios from 'axios'
import {commonParams} from './config'

export function getHotKey() {
  const url = '/api/getHotKey'

  const data = Object.assign({}, commonParams, {
    platform: 'h5',
    format: 'json'
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
export function getSuggest(query, page, perpage = 20, showSinger = true) {
  const url = '/api/getSuggest'

  const data = Object.assign({}, commonParams, {
    w: query,
    p: page,
    perpage,
    n: perpage,
    catZhida: showSinger ? 1 : 0,
    zhidaqu: showSinger ? 1 : 0,
    t: 0,
    flag: 1,
    ie: 'utf-8',
    sem: 1,
    aggr: 0,
    remoteplace: 'txt.mqq.all',
    uin: 0,
    needNewCode: 1,
    platform: 'h5',
    format: 'json'
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
