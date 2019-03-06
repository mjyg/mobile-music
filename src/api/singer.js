import {commonParams} from './config'
import axios from 'axios'

export function getSingerList() {
  const url = '/api/getSingerList'
  return axios.get(url, {
    params: commonParams
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
