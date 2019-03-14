import axios from 'axios'
import {commonParams} from './config'

export function getRank() {
  const url = '/getRank'
  const params = Object.assign({}, commonParams, {
    format: 'json'
  })
  return axios.get(url, {
    params
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
