// import jsonp from 'common/js/jsonp'
// import {commonParams, options} from './config'
import axios from 'axios'

// 写代理接口
// request('/api/getRecommend', function (err, res, body) {
//   const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'
//   axios.get(url, {
//     headers: {
//       referer: 'https://c.y.qq.com',
//       host: 'c.y.qq.com',
//       'Access-Control-Allow-Origin': '*'
//     },
//     params: Object.assign({}, commonParams, {
//       platform: 'h5',
//       uin: 0,
//       needNewCode: 1
//     }),
//     responseType: 'jsonp'
//   })
// })

export function getRecommend() {
  return axios.get('/static/json/recommend.json')
}
