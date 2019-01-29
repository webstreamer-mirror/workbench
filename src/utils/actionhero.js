// import {ActionheroWebsocketClient} from './ActionheroWebsocketClient'
import Cookies from 'js-cookie'

const ApiUrlTokenKey = 'webstreamer-api-Token'

var apiUrl_
export function getApiUrl() {
    if (apiUrl_) {
        return apiUrl_
    }
    return Cookies.get(ApiUrlTokenKey)
}

export function setApiUrl(url) {
    apiUrl_ = url
    return Cookies.set(ApiUrlTokenKey, url)
}

export function removeApiUrl() {
    apiUrl_ = undefined
    return Cookies.remove(ApiUrlTokenKey)
}

export class WebsocketClient {
    constructor(options, client) {
        if (options) {
            options.url = options.url || getApiUrl()
        } else {
            options = { url: getApiUrl() }
        }
        this.client_ = new ActionheroWebsocketClient(options, client)
    }

    action(action, params) {
        let self = this;
        return new Promise((resolve, reject) => {
            self.client_.action(action, params, (data) => {
                if (data.error) {
                    reject(data.error)
                } else {
                    resolve(data)
                }
            })
        })
    }
}

