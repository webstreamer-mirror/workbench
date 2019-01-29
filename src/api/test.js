import request from '@/utils/request'

export function create_rtsp_test_server(option) {
    const data = {
        "id": option.id,
        "port": option.port,
        "path": option.path,
        "video": option.video,
        "audio": option.audio
    }

    return request({
        url: '/test/test_server',
        method: 'post',
        data: data
    })
}

export function destroy_rtsp_test_server(id) {

    return request({
        url: '/test/test_server',
        method: 'delete',
        params: { 'id': id }
    })
}