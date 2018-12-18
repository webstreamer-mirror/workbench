import request from '@/utils/request'
import { WebsocketClient, setApiUrl } from '@/utils/actionhero'
export function loginByUsername(username, password, webstreamer) {
  const data = {
    username,
    password
  }
  var client = new WebsocketClient({ url: webstreamer })
  return new Promise((resolve, reject) => {
    data.httpMethod = 'GET'
    client.action('login', data).then((res) => {
      setApiUrl(webstreamer)
      resolve({ data: { token: 'admin' }})
    }).catch((error) => {
      console.log('error', error)
      reject(error)
    })
  })
}

export function logout() {
  return new Promise((resolve, reject) => {
    resolve() // always success
  })
}

export function getUserInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

