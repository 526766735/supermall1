import axios from 'axios'
// 为了应对开发在服务器不在同一个ip地址中，不使用全局
export function request(config) {
    // 1.创建axios实例
    const instance = axios.create({
        baseURL: 'http://152.136.185.210:7878/api/m5',
        timeout: 5000
    })

    // 2.axios拦截器
    instance.interceptors.request.use(config => {
        // console.log(config)
        // 1.比如config中有一些信息不符合服务器的要求

        // 2.比如每次发送网络请求时，都希望在页面上显示一个请求图标

        // 3某些网络请求（比如登录（token）），必须携带一些特殊的信息
        return config
    }, err => {
        console.log('请求失败');
    })

    // 2.2响应拦截
    instance.interceptors.response.use(res => {
            // console.log(res)
            return res.data
        }, err => {
            console.log(err);
        })
        // 3.发送真正的网络请求
    return instance(config)
}