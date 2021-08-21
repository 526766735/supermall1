<template>
  <div id="home">
    <!-- 头部导航栏 -->
    <nav-bar class="home-nav">
      <div slot="center">购物街</div>
    </nav-bar>
    <!-- tab-control -->
    <tab-control :titles="['流行', '新款', '精选']" @tabClick='tabClick' ref="tabControl1" class="tab-control" v-show="isFixed" />
    <!-- betterscroll -->
    <scroll class="content" ref="scroll" :probe-type='3' @scroll="contentScroll" :pull-up-load='true' @pullingUp='loadMore'>
      <!-- 轮播图 -->
      <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad" />
      <!-- 推荐 -->
      <home-recommend-view :recommends="recommends" />
      <!-- 本周流行 -->
      <home-feature-view />
      <!-- tab-control -->
      <tab-control :titles="['流行', '新款', '精选']" @tabClick='tabClick' ref="tabControl2" />
      <!-- 首页商品数据 -->
      <good-list :goods='showGoods' />
    </scroll>
    <back-top @click.native='backClick' v-show="contentShow" />
  </div>
</template>

<script>
import NavBar from "components/common/navbar/NavBar.vue"
import HomeSwiper from "./childComper/HomeSwiper.vue"
import HomeRecommendView from "./childComper/HomeRecommendView.vue"
import HomeFeatureView from "./childComper/HomeFeatureView.vue"
import TabControl from "components/content/tabControl/TabControl.vue"
import GoodList from 'components/content/goods/GoodList.vue'
import Scroll from 'components/common/scroll/Scroll.vue'
import BackTop from 'components/content/backTop/BackTop.vue'

import { getHomeMultidata, getHomeGoods } from "network/home"
import { debounce } from "common/utils"
// import { itemListenerMixin } from "common/mixin"


export default {
  name: "Home",
  components: {
    NavBar,
    HomeSwiper,
    HomeRecommendView,
    HomeFeatureView,
    TabControl,
    GoodList,
    Scroll,
    BackTop,
  },
  // mixins: [itemListenerMixin],
  data() {
    return {
      banners: [],
      recommends: [],
      goods: {
        'pop': { page: 0, list: [] },
        'new': { page: 0, list: [] },
        'sell': { page: 0, list: [] },
      },
      currentType: 'pop',
      contentShow: false,
      tabOffsetTop: 0,
      isFixed: false,
      saveY: 0,
      itemListener: null
    };
  },
  created() {
    //  1.请求多个数据
    this.getHomeMultidata()

    // 2.请求商品数据
    this.getHomeGoods('pop')
    this.getHomeGoods('new')
    this.getHomeGoods('sell')


  },
  mounted() {

    // 1.图片加载完成的事件监听
    const refresh = debounce(this.$refs.scroll.refresh, 50)
    this.$bus.$on('homeItemImageLoad', () => {
      refresh()
    })

    // const refresh = debounce(this.$refs.scroll.refresh, 500)
    // // 3.监听item中图片加载完成
    // //对监听的事件进行保存 
    // this.itemListener = () => { this.$refs.scroll && refresh() }
    // this.$bus.$on('itemImageLoad', this.itemListener)
    // console.log('首页 打开监听');
  },
  // 回到首页时回到离开前的位置
  activated() {
    this.$refs.scroll.scrollTo(0, this.saveY, 0)
    this.$refs.scroll.refresh()
  },
  // 记录离开首页是页面的位置
  deactivated() {
    // 保存y值
    this.saveY = this.$refs.scroll.getScrollY()
    // 取消全局事件的监听
    // // this.$bus.$off('itemImageLoad',函数)
    // this.$bus.$off('itemImageLoad', this.itemListener)
    // console.log("首页 关闭监听");
  },
  destroyed() {
    // 取消全局事件的监听  ;
    // this.$bus.$off('itemImageLoad', this.itemListener)
    // console.log("首页 关闭监听");
  },

  computed: {
    showGoods() {
      return this.goods[this.currentType].list
    }
  },
  methods: {
    /**
       * 相关事件
       */

    tabClick(index) {
      // console.log(index);
      switch (index) {
        case 0:
          this.currentType = 'pop'
          break
        case 1:
          this.currentType = 'new'
          break
        case 2:
          this.currentType = 'sell'
          break
      }
      this.$refs.tabControl1.currentIndex = index
      this.$refs.tabControl2.currentIndex = index

    },
    // 回到顶部
    backClick() {
      // console.log(11);
      this.$refs.scroll.scrollTo(0, 0, 500)
    },
    // 隐藏tab-control
    contentScroll(position) {
      // console.log(position);
      // 判断backTop是否显示
      this.contentShow = (-position.y) > 1000
      // 判断tab—control是否吸顶
      this.isFixed = (-position.y) > this.tabOffsetTop
    },
    // 上拉加载更多
    loadMore() {
      // console.log(111);
      this.getHomeGoods(this.currentType)
    },
    swiperImageLoad() {
      // 获取tabControl的offsetTop值   所有组件都有一个属性 $el:用于获取组件中的元素
      // console.log(this.$refs.tabControl.$el.offsetTop);
      this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop
    },

    /**
     * 网络请求
     */
    getHomeMultidata() {
      getHomeMultidata().then(res => {
        // console.log(res)
        this.banners = res.data.banner.list
        this.recommends = res.data.recommend.list
      })
    },

    getHomeGoods(type) {
      const page = this.goods[type].page + 1
      getHomeGoods(type, page).then(res => {
        this.goods[type].list.push(...res.data.list)
        this.goods[type].page += 1
        // 完成上拉加载更多
        this.$refs.scroll.finishPullUp()
      })
    }
  }
}
</script>

<style scoped>
.home-nav {
  background-color: var(--color-tint);
  color: #fff;
  /* position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 2; */
}
.tab-control {
  position: relative;
  z-index: 9;
}
#home {
  /* padding-top: 44px; */
  position: relative;
  height: 100vh;
}
.content {
  position: absolute;
  top: 44px;
  bottom: 49px;
  left: 0;
  right: 0;
  overflow: hidden;
}
</style>
