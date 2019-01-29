import { create_rtsp_test_server, destroy_rtsp_test_server } from '@/api/test'

const test = {
    actions: {
        CreateRtspTestServer({ commit }, info) {
            return new Promise((resolve, reject) => {
                create_rtsp_test_server(info).then(response => {
                    resolve()
                }).catch(error => {
                    reject(error)
                })
            })
        },
        DestroyRtspTestServer({ commit }, id) {
            return new Promise((resolve, reject) => {
                destroy_rtsp_test_server(id).then(response => {
                    resolve()
                }).catch(error => {
                    reject(error)
                })
            })
        }
    }
}

export default test
