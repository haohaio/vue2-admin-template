
import request from '@/utils/request.js'

// 登录接口
export function login(data) {
  return request({
    url: '/interface/login',
    method: 'post',
    data
  })
}

// 退出登录
export function logout(data) {
  return request({
    url: '/interface/logout',
    method: 'post',
    data
  })
}
