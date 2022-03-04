import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'
import { CancelRequests } from '@/utils/request'

/* Layout */
import Layout from '@/layout'

Vue.use(VueRouter)

export const routes = [
  {
    path: '/',
    component: Layout,
    redirect: '/home'
  },
  {
    path: '/home',
    component: Layout,
    redirect: '/home/index',
    name: 'Home',
    children: [
      {
        path: 'index',
        component: () => import('@/views/home'),
        name: 'HomeIndex',
        meta: {
          title: '首页',
          icon: 'records'
        }
      }
    ]
  },
  {
    path: '/person',
    component: Layout,
    redirect: '/person/index',
    name: 'Person',
    children: [
      {
        path: 'index',
        component: () => import('@/views/person'),
        name: 'PersonIndex',
        meta: { title: '人员信息', icon: 'person' }
      }
    ]
  },

  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login'),
    hidden: true
  },

  // 404
  { path: '*', redirect: '/', hidden: true }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

router.beforeEach((to, from, next) => {
  CancelRequests.forEach((request, index) => {
    request.cancel()
    delete CancelRequests[index]
  })
  store.dispatch('loading/clean')
  next()
})

export default router
