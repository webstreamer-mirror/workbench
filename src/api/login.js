import request from '@/utils/request'
import { WebsocketClient, setApiUrl } from '@/utils/actionhero'
export function loginByUsername(username, password, webstreamer) {
    return new Promise((resolve, reject) => {
        resolve({ data: { token: 'admin' } }) // always success
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

