import Toast from './Toast'

const obj = {}
obj.install = function(Vue) {
    // 创建组件构造器
    const toastContrustor = Vue.extend(Toast)

    // 2.new发式，根据组件构造器，可以创建出来一个组件对象
    const toast = new toastContrustor()

    // 3.将组建对象。手动挂载到某一元素上
    toast.$mount(document.createElement('div'))

    // 4.total.$el对应的就是div
    document.body.appendChild(toast.$el)

    Vue.prototype.$toast = toast
}
export default obj