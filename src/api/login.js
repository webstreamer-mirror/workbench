import request from '@/utils/request'

export function loginByUsername(username, password, webstreamer) {
  const data = {
    username,
    password
  }
  console.log('=========>', webstreamer)
  return request({
    url: '/login/login',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/login/logout',
    method: 'post'
  })
}

export function getUserInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

