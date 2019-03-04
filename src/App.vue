<template>
  <div id="app">
    <m-headr></m-headr>
    <tab></tab>
    <router-view></router-view>
  </div>
</template>

<script>
import MHeadr from 'components/m-header/m-header'
import Tab from 'components/tab/tab'

export default {
  components: {
    MHeadr,
    Tab
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
</style>
