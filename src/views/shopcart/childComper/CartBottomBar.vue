<template>
  <div class="bottom-bar">
    <div class="check-content" @click="checkClick">
      <check-button class="check-all" :is-checked="isSelectAll" /><span>全选</span>
    </div>
    <div class="total">合计:{{totalPrice}}</div>
    <div class="calculate" @click="calcClick">去结算:({{checkLength}})</div>
  </div>
</template>

<script>
import CheckButton from 'components/content/checkButton/CheckButton.vue'
export default {
  name: 'CartBottomBar',
  components: {
    CheckButton
  },
  methods: {
    checkClick() {
      // console.log(11);
      if (this.isSelectAll) {
        this.$store.state.cartList.forEach(item => item.checked = false)
      } else {
        this.$store.state.cartList.forEach(item => item.checked = true)
      }
    },
    calcClick() {
      if (this.$store.state.cartList.every(item => !item.checked)) {
        this.$toast.show('未选择商品')
      }
    }
  },
  computed: {
    totalPrice() {
      return '￥' + this.$store.state.cartList.filter(item => {
        return item.checked
      }).reduce((preValue, item) => {
        return preValue + item.price * item.count
      }, 0).toFixed(2)
    }, checkLength() {
      return this.$store.state.cartList.filter(item => item.checked).reduce((pre, item) => {
        return pre + item.count
      }, 0)
    }, isSelectAll() {
      if (this.$store.state.cartList.length === 0) {
        return false
      } else {
        return !this.$store.state.cartList.find(item => !item.checked)
        // return this.$store.state.cartList.every(item => item.checked)

      }

    }
  }
}
</script>

  <style scoped>
.bottom-bar {
  font-size: 14px;
  display: flex;
  height: 40px;
  background-color: #eee;
  position: relative;
  line-height: 40px;
  /* padding-top: 12px; */
}
.check-content {
  display: flex;
  margin-right: 10px;
  width: 80px;
}
.check-all {
  height: 20px;
  width: 20px;
  margin-top: 10px;
  line-height: 20px;
  margin-left: 10px;
  margin-right: 5px;
}
.total {
  flex: 1;
}
.calculate {
  width: 90px;
  background: orangered;
  color: #fff;
  text-align: center;
  font-weight: 700;
}
</style >