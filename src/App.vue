<template>
  <div id="app">
    <keep-alive exclude="Detail">
      <router-view />
    </keep-alive>
    <main-bar />
  </div>
</template>

<script>
import MainBar from 'components/content/MainTabbar/MainBar'
export default {
  name: 'app',
  components: {
    MainBar

  }
}
</script>
<style>
@import url('assets/css/base.css');
</style>
