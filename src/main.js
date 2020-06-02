import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import 'default-passive-events'
// 导入全局样式表
import './assets/css/global.css'
import treeTable from 'vue-table-with-tree-grid'

// 导入element-ui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 导入vue 富文本编辑器
import VueQuillEditor from 'vue-quill-editor'

// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
Vue.use(VueQuillEditor)
Vue.use(ElementUI)
// 全局注册 数形表格
Vue.component('tree-table', treeTable)
// 导入axios
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http = axios

Vue.config.productionTip = false

// 定义全局 时间过滤器
Vue.filter('dateFormat', function(val) {
  const time = new Date(val)
  const y = time.getFullYear()
  const m = (time.getMonth() + 1 + '').padStart(2, '0')
  const d = (time.getDate() + '').padStart(2, '0')
  const h = (time.getHours() + '').padStart(2, '0')
  const min = (time.getMinutes() + '').padStart(2, '0')
  const s = (time.getSeconds() + '').padStart(2, '0')
  return `${y}-${m}-${d} ${h}:${min}:${s}`
})
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
