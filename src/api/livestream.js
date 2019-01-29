import request from '@/utils/request'

export function create_livestream(option) {
    const data = {
        "id": option.id,
        "url": option.url,
        "video": option.video,
        "audio": option.audio
    }

    return request({
        url: '/livestream',
        method: 'post',
        data: data
    })
}

export function destroy_livestream(id) {

    return request({
        url: '/livestream',
        method: 'delete',
        params: { 'id': id }
    })
}

export function start_livestream(id) {

    return request({
        url: '/livestream/status',
        method: 'put',
        params: { 'id': id, 'status': 'start' }
    })
}
export function stop_livestream(id) {

    return request({
        url: '/livestream/status',
        method: 'put',
        data: { 'id': id, 'status': 'stop' }
    })
}
export function add_audience(id, name, option) {
    return request({
        url: '/livestream/audience',
        method: 'post',
        data: { 'id': id, 'name': name, 'option': option }
    })
}
export function remove_audience(id, name) {

    return request({
        url: '/livestream/audience',
        method: 'delete',
        params: { 'id': id, 'name': name }
    })
}