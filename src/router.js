import Vue from 'vue'
import Router from 'vue-router'
import login from './components/login.vue'
import home from './components/Home.vue'

Vue.use(Router)
const router = new Router({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: login },
    { path: '/home', component: home }
  ]
})
// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to 将要访问的路径  from 原路径  next 是一个函数，表示放行
  // next() 放行  next('/login') 强制跳转
  if (to.path == '/login') return next()
  const token = window.sessionStorage.getItem('token')
  if (!token) return next('/login')
  next()
})

export default router