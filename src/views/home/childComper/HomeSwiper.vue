<template>
  <swiper>
    <swiper-item v-for='(item,index) in banners' :key="index">
      <a :href="item.link">
        <img :src="item.image" alt="" @load="imageLaod">
      </a>
    </swiper-item>
  </swiper>
</template>

<script>
import { Swiper, SwiperItem } from 'components/common/swiper'

export default {
  name: 'HomeSwiper',
  data() {
    return {
      isImageLoad: false
    }
  },
  components: {
    Swiper,
    SwiperItem
  },
  methods: {
    imageLaod() {
      if (!this.isImageLoad) {
        this.$emit('swiperImageLoad')
        this.isImageLoad = true
      }
    }
  },
  props: {
    banners: {
      type: Array,
      default() {
        return []
      }
    }
  },


}
</script>

<style>
</style>