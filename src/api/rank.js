import axios from 'axios'
import {commonParams} from './config'

export function getRank() {
  const url = '/api/getRank'
  const params = Object.assign({}, commonParams, {
    format: 'json'
  })
  return axios.get(url, {
    params
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
export function getTopList(topid) {
  const url = '/api/getTopList'
  const params = Object.assign({}, commonParams, {
    topid,
    needNewCode: 1,
    uin: 0,
    tpl: 3,
    page: 'detail',
    type: 'top',
    platform: 'yqq.json'
  })
  return axios.get(url, {
    params
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
