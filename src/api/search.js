import axios from 'axios'
import {commonParams} from './config'

export function getHotKey() {
  const url = '/getHotKey'

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
