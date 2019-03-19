import Vue from 'vue'
import Router from 'vue-router'
// import Rank from 'components/rank/rank'
// import Recommend from 'components/recommend/recommend'
// import Search from 'components/search/search'
// import Singer from 'components/singer/singer'
// import SingerDetail from 'components/singer-detail/singer-detail'
// import Disc from 'components/disc/disc'
// import TopList from 'components/top-list/top-list'
// import UserCenter from 'components/user-center/user-center'

// 路由懒加载
const Rank = () => import(/* webpackChunkName: "rank" */'components/rank/rank')
const Recommend = () => import(/* webpackChunkName: "recommend" */'components/recommend/recommend')
const Singer = () => import(/* webpackChunkName: "singer" */'components/singer/singer')
const SingerDetail = () => import(/* webpackChunkName: "singerDetail" */'components/singer-detail/singer-detail')
const Disc = () => import(/* webpackChunkName: "disc" */'components/disc/disc')
const TopList = () => import(/* webpackChunkName: "topList" */'components/top-list/top-list')
const UserCenter = () => import(/* webpackChunkName: "userCenter" */'components/user-center/user-center')
const Search = () => import(/* webpackChunkName: "search" */'components/search/search')

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/recommend'
    },
    {
      path: '/rank',
      component: Rank,
      children: [
        {
          path: ':id',
          component: TopList
        }
      ]
    },
    {
      path: '/recommend',
      component: Recommend,
      children: [
        {
          path: ':id',
          component: Disc
        }
      ]
    },
    {
      path: '/singer',
      component: Singer,
      children: [
        {
          path: ':id', // 以id为变量
          component: SingerDetail
        }
      ]
    },
    {
      path: '/search',
      component: Search,
      children: [
        {
          path: ':id', // 以id为变量
          component: SingerDetail
        }
      ]
    },
    {
      path: '/userCenter',
      component: UserCenter
    }
  ]
})
