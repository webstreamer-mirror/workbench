import { create_livestream, destroy_livestream, start_livestream, stop_livestream, add_audience, remove_audience } from '@/api/livestream'

const livestream = {
    actions: {
        CreateLivestream({ commit }, info) {
            return new Promise((resolve, reject) => {
                create_livestream(info).then(response => {
                    resolve("OK!")
                }).catch(error => {
                    reject(error.response.data.error)
                })
            })
        },
        DestroyLivestream({ commit }, id) {
            return new Promise((resolve, reject) => {
                destroy_livestream(id).then(response => {
                    resolve("OK!")
                }).catch(error => {
                    reject(error.response.data.error)
                })
            })
        },
        StartLivestream({ commit }, id) {
            return new Promise((resolve, reject) => {
                start_livestream(id).then(response => {
                    resolve("OK!")
                }).catch(error => {
                    reject(error.response.data.error)
                })
            })
        },
        StopLivestream({ commit }, id) {
            return new Promise((resolve, reject) => {
                stop_livestream(id).then(response => {
                    resolve("OK!")
                }).catch(error => {
                    reject(error.response.data.error)
                })
            })
        },
        AddAudience({ commit }, info) {
            return new Promise((resolve, reject) => {
                add_audience(info.id, info.name, info.option).then(response => {
                    console.log('-------add audience-------')
                    resolve("OK!")
                }).catch(error => {
                    reject(error.response.data.error)
                })
            })
        },
        RemoveAudience({ commit }, info) {
            return new Promise((resolve, reject) => {
                remove_audience(info.id, info.name).then(response => {
                    resolve("OK!")
                }).catch(error => {
                    reject(error.response.data.error)
                })
            })
        },
    }
}

export default livestream
