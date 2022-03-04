import axios from 'axios'
import router from '@/router'
import store from '@/store'
import { Message } from 'element-ui'
import { TokenKey, getToken, removeToken } from '@/utils/auth'
import { getIp } from '@/utils'

export const CancelRequests = []
const noMessageErrorURL = []
const noLoadingURL = []
const noTimeoutURL = []

const service = axios.create({
  timeout: 30 * 1000,
  timeoutErrorMessage: '网络超时'
})

// request interceptor
service.interceptors.request.use(
  (config) => {
    // 跳转下一个页面时，取消上一个页面未结束的请求
    config.cancelToken = new axios.CancelToken((cancel) => {
      CancelRequests.push({ cancel })
    })

    if (noTimeoutURL.includes(config.url)) {
      config.timeout = 0
    }

    if (process.env.NODE_ENV === 'development') {
      config.baseURL = process.env.VUE_APP_BASE_API
    } else {
      config.baseURL = getIp()
    }

    config.headers[TokenKey] = getToken()

    if (!noLoadingURL.includes(config.url)) {
      store.dispatch('loading/show')
    }

    return config
  },
  (error) => {
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  (response) => {
    if (!noLoadingURL.includes(response.config.url)) {
      store.dispatch('loading/hide')
    }
    const res = response.data

    if (res.resCode === 0) {
      return res.resData
    } else {
      if (!noMessageErrorURL.includes(response.config.url)) {
        Message({
          message: res.resMsg || '请求失败！',
          type: 'error'
        })
      }
      return Promise.reject(new Error(res.resMsg || 'Error'))
    }
  },
  (error) => {
    // 取消请求时，会抛出 error，但无需错误提示
    if (axios.isCancel(error)) {
      return
    }
    store.dispatch('loading/hide')

    if (error && error.response && error.response.status === 401) {
      Message({
        message: '请重新登录!',
        type: 'warning'
      })
      removeToken()
      router.push('/login')
    } else {
      Message({
        message: error || '请求失败！',
        type: 'error'
      })
    }
    console.log('err' + error) // for debug

    return Promise.reject(error)
  }
)

export default service
