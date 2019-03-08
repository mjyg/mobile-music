import axios from 'axios'
import {commonParams} from './config'

export function getSingerList() {
  const url = '/api/getSingerList'
  return axios.get(url, {
    params: commonParams
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

export function getSingerDetail(singerId) {
  const url = '/getSingerDetail'
  const data = Object.assign({}, commonParams, {
    loginUin: 0,
    hostUin: 0,
    format: 'json',
    platform: 'yqq.json',
    needNewCode: 0,
    ct: 24,
    order: 'listen',
    begin: 0,
    num: 80,
    singermid: singerId
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
