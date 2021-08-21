<template>
    <div class="tab-bar-item" @click="itemClick"> 
      <!-- <img src="../../assets/img/tabbar/home.png" alt="">
     <div>首页</div> -->
     <div v-if="!isActive"><slot name="item-icon"></slot></div>
     <div  v-else><slot name="item-icon-active"></slot></div>
     <div :style="activeStyle"><slot name="item-text"></slot></div>
    </div>
</template>

<script>
export default {
name:'TabBarItem',
props:{
  // 子组件通过props获取父组件的值
  path:String,

  activeColor:{
    type:String,
    default:'red'
  }
},
data(){
  return{
    // isActive:true
  }
},
computed:{
  isActive(){
    return this.$route.path==this.path
    // return this.$route.path.indexOf(this.path) !== -1
  },
  activeStyle(){
  return this.isActive?{color:this.activeColor}:{}
  }
},
methods: {
  itemClick(){
this.$router.replace(this.path).catch(e=>e)
  }
},
}
</script>

<style>

.tab-bar-item {
    flex: 1;
    text-align: center;
    height: 49px;
    font-size: 14px;
    /* line-height: 49px; */
}
.tab-bar-item img{
  height: 24px;
  width: 24px;
  margin-top: 3px;
  margin-bottom: 2px;
  vertical-align: middle;
}

</style>