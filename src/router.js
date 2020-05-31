import Vue from 'vue'
import Router from 'vue-router'
import login from './components/login.vue'
import home from './components/Home.vue'
import welcome from './components/Welcome.vue'
import users from './components/user/users.vue'
import rights from './components/power/rights.vue'
import roles from './components/power/roles.vue'
import goods from './components/goods/goods.vue'
import params from './components/goods/params.vue'
import categories from './components/goods/categories.vue'
import orders from './components/orders.vue'
import reports from './components/reports.vue'

Vue.use(Router)
const router = new Router({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/home', redirect: '/welcome' },
    { path: '/login', component: login },
    {
      path: '/home',
      component: home,
      children: [
        { path: '/welcome', component: welcome },
        { path: '/users', component: users },
        { path: '/rights', component: rights },
        { path: '/roles', component: roles },
        { path: '/goods', component: goods },
        { path: '/params', component: params },
        { path: '/categories', component: categories },
        { path: '/orders', component: orders },
        { path: '/reports', component: reports }
      ]
    }
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
