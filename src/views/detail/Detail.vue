<template>
  <div id="detail">
    <!-- 头部导航 -->
    <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="nav" />
    <!-- better Scroll -->
    <scroll class="content" ref="scroll" :probe-type='3' @scroll="contentScroll">
      <!-- 轮播图 -->
      <detail-swiper :top-images="topImages" />
      <!-- 基本信息 -->
      <detail-base-info :goods="goods" />
      <!-- 店铺信息 -->
      <detail-shop-info :shop="shop" />
      <!-- 商品详细信息 -->
      <detail-goods-info :detailInfo="detailInfo" @imageLoad="imageLoad" />
      <!-- 参数信息 -->
      <detail-param-info :paramInfo="paramInfo" ref="param" />
      <!-- 评论 -->
      <detail-comment-info :commentInfo="commentInfo" ref="comment" />
      <!-- 更多推荐 -->
      <good-list :goods="recommends" ref="list" />
    </scroll>
    <!-- 回到顶部 -->
    <back-top @click.native='backClick' v-show="contentShow" />
    <!-- 底部导航 -->
    <detail-bottom-bar @addToCart="addToCart" />
  </div>
</template>

<script>
import DetailNavBar from './childComper/DetailNavBar'
import DetailSwiper from './childComper/DetailSwiper'
import DetailBaseInfo from './childComper/DetailBaseInfo.vue'
import DetailShopInfo from './childComper/DetailShopInfo.vue'
import Scroll from 'components/common/scroll/Scroll.vue'
import DetailGoodsInfo from './childComper/DetailGoodsInfo.vue'
import DetailParamInfo from './childComper/DetailParamInfo.vue'
import DetailCommentInfo from './childComper/DetailCommentInfo.vue'
import GoodList from 'components/content/goods/GoodList.vue'
import DetailBottomBar from './childComper/DetailBottomBar.vue'
import BackTop from 'components/content/backTop/BackTop.vue'

import { getDetail, Goods, Shop, GoodsParam, getRecommend } from 'network/detail'
import { debounce } from "common/utils"
// import { itemListenerMixin } from "common/mixin"
import { mapActions } from 'vuex'


export default {
  name: "Detail",
  components: {
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    Scroll,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailCommentInfo,
    GoodList,
    DetailBottomBar,
    BackTop,
  },

  // mixins: [itemListenerMixin],
  data() {
    return {
      iid: null,
      // res: null,
      topImages: [],
      goods: {},
      shop: {},
      detailInfo: {},
      paramInfo: {},
      commentInfo: {},
      recommends: [],
      // itemListener: null,
      themeTopYs: [],
      getThemeTop: null,
      currentIndex: 0,
      contentShow: false,
    }
  },
  created() {
    // 1.保存传入的iid
    this.iid = this.$route.params.iid

    // 2.根据iid请求详细数据
    getDetail(this.iid).then(res => {
      // console.log(res);
      // 1.获取数据
      const data = res.result

      // 2.获取顶部的图片轮播数据
      this.topImages = data.itemInfo.topImages

      //3.获取商品信息 
      this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)

      // 4.创建店铺信息的对象
      this.shop = new Shop(data.shopInfo)

      // 5.获取商品详细信息
      this.detailInfo = data.detailInfo

      // 6.获取参数信息
      this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)


      // 7.取出评论的信息
      if (data.rate.cRate !== 0) {
        this.commentInfo = data.rate.list[0]
      }
    }),

      // 3.请求推荐数据
      getRecommend().then(res => {
        // console.log(res);
        this.recommends = res.data.list
      })

    // 4.给getThemeTop赋值(对this.themeTopYs赋值的操作进行防抖)
    this.getThemeTop = debounce(() => {
      this.themeTopYs = []
      this.themeTopYs.push(0)
      this.themeTopYs.push(this.$refs.param.$el.offsetTop)
      this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
      this.themeTopYs.push(this.$refs.list.$el.offsetTop)
      this.themeTopYs.push(Number.MAX_VALUE)
      // console.log(this.themeTopYs);
    }, 100)
  },
  mounted() {
    const refresh = debounce(this.$refs.scroll.refresh, 50)
    this.$bus.$on('detailItemImageLoad', () => {
      refresh()
    })

    // const refresh = debounce(this.$refs.scroll.refresh, 500)
    // this.itemListener = () => {
    //   this.$refs.scroll && refresh()
    // }
    // this.$bus.$on('itemImageLoad', this.itemListener)
    // console.log('详情页 打开监听');
  },
  // destroyed() {
  //   this.$bus.$off('itemImageLoad', this.itemListener)
  //   console.log('详情页 关闭监听');
  // },
  methods: {
    ...mapActions(['addCart']),
    imageLoad() {
      this.$refs.scroll.refresh()
      this.getThemeTop()
    },
    titleClick(index) {
      // console.log(index);
      this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 400)
    },
    // 回到顶部
    backClick() {
      // console.log(11);
      this.$refs.scroll.scrollTo(0, 0, 500)
    },
    // 添加到购物车
    addToCart() {
      // console.log('-------');
      // 1.获取购物车需要展示的信息
      const product = {}
      product.image = this.topImages[0]
      product.title = this.goods.title
      product.desc = this.goods.desc
      product.price = this.goods.realPrice
      product.iid = this.iid

      // 2.将商品添加到购物车里
      // this.$store.cartList.push(product)
      // this.$store.commit('addCart', product)
      this.addCart(product).then(res => {
        // this.$toast.show(res, 2000)
        // console.log(this.$toast);
        this.$toast.show(res, 1500)
      })
      // this.$store.dispatch('addCart', product).then(res => {
      //   console.log(11);
      // })

    },
    contentScroll(position) {
      // console.log(position);
      // 1.获取y值
      const positionY = -position.y

      // 2.positionY与主题中的值对比
      const length = this.themeTopYs.length
      for (let i = 0; i <= length - 1; i++) {
        if (this.currentIndex !== i && (positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i + 1])) {
          this.currentIndex = i
          // console.log(this.currentIndex);
          this.$refs.nav.currentIndex = this.currentIndex
        }
      }
      // 判断backTop是否显示
      this.contentShow = (-position.y) > 1000
      // for (let i = 0; i <= length; i++) {
      //   if (this.currentIndex !== i && ((i < length - 1 && positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i + 1]) || (i === length - 1) && (positionY >= this.themeTopYs[i]))) {
      //     this.currentIndex = i
      //     console.log(this.currentIndex);
      //     this.$refs.nav.currentIndex = this.currentIndex
      //   }
      // }
      // if (positionY < this.themeTopYs[1]) {
      //   this.$refs.nav.currentIndex = 0
      // } else if (positionY >= this.themeTopYs[1] && positionY < this.themeTopYs[2]) {
      //   this.$refs.nav.currentIndex = 1
      // } else if (positionY >= this.themeTopYs[2] && positionY < this.themeTopYs[3]) {
      //   this.$refs.nav.currentIndex = 2
      // } else if (positionY >= this.themeTopYs[3]) {
      //   this.$refs.nav.currentIndex = 3
      // }
    }
  },
}
</script>

<style scoped>
#detail {
  position: relative;
  z-index: 10;
  background-color: #fff;
  height: 100vh;
}
.content {
  /* height: calc(100% - 44px - 58px); */
  position: fixed;
  top: 44px;
  bottom: 58px;
}
.detail-nav {
  position: relative;
  background-color: #fff;
  z-index: 1;
}
</style>