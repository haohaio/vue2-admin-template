import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/index.scss'
import App from './App.vue'
import router from './router'
import store from './store'
import './icons' // icon
import TopBar from './components/TopBar'

Vue.config.productionTip = false
Vue.use(TopBar)
Vue.use(ElementUI)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
