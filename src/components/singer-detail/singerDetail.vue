<template>
    <div class="singer-detail"></div>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  computed: {
    ...mapGetters(['singer']) // 相当于this.$store.state.singer 
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .singer-detail
    position fixed
    background $color-background
    z-index 100
    top 0
    bottom 0
    left 0
    right 0
</style>
