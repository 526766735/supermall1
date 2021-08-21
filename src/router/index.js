import Vue from 'vue'
import VueRouter from 'vue-router'

const Home = () =>
    import ('views/home/Home')
const Profile = () =>
    import ('views/profile/Profile')
const ShopCart = () =>
    import ('views/shopcart/ShopCart')
const Category = () =>
    import ('views/category/Category')
const Detail = () =>
    import ('views/detail/Detail')
Vue.use(VueRouter)

const routes = [{
    path: '',
    redirect: '/home'
}, {
    path: '/home',
    component: Home
}, {
    path: '/category',
    component: Category
}, {
    path: '/shopcart',
    component: ShopCart
}, {
    path: '/profile',
    component: Profile
}, {
    path: '/detail/:iid',
    component: Detail
}]


const router = new VueRouter({
    routes,
    mode: 'hash',
    base: process.env.BASE_URL,
})

router.onError((error) => {
    const pattern = /Loading chunk (\d)+ failed/g;
    const isChunkLoadFailed = error.message.match(pattern);
    const targetPath = router.history.pending.fullPath;
    if (isChunkLoadFailed) {
        router.replace(targetPath);
    }
});

export default router