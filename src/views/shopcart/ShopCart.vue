<template>
  <div class="cart">
    <nav-bar class="nav-bar">
      <div slot="center">购物车({{num}})</div>
    </nav-bar>
    <!-- 商品列表 -->
    <cart-list />
    <!-- bottom bar -->
    <cart-bottom-bar />
  </div>
</template>

<script>
import NavBar from 'components/common/navbar/NavBar.vue'
import CartList from './childComper/cartList'

import { mapGetters } from 'vuex'
import CartBottomBar from './childComper/CartBottomBar.vue'

export default {
  name: 'ShopCart',
  components: {
    NavBar,
    CartList,
    CartBottomBar,

  },
  computed: {
    // 两种语法
    // ...mapGetters(['cartLength'])
    ...mapGetters({
      num: 'cartLength'
    })

  }
}
</script>
<style scoped>
.nav-bar {
  background-color: var(--color-tint);
  color: #fff;
}
.cart {
  height: 100vh;
}
</style>