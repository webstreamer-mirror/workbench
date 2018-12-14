<template>
  <div class="app-container">

    <label>Server : </label>
    <el-input v-model="server" style="width:85%;"/>
    <br>
    <label>Room ID : </label>
    <el-input v-model="roomId" style="width:30%;" />
    <offer-option ref="offerSend" title="Send" />
    <offer-option ref="offerRecv" title="Receive" />
    <br>
    <el-button style="margin-bottom:20px;" type="primary" icon="webrtc" @click="join"> Join </el-button>
    <el-button style="margin-bottom:20px;" type="primary" icon="webrtc" @click="leave"> Leave </el-button>

    <vue-webrtc ref="webrtc" width="100%" @error="onWebRTCError" />
  </div>
</template>

<script>
import WebRTC from './components/webrtc'
import OfferOption from './components/offerOption'
export default {
  name: 'WebrtcConsole',
  components: { 'vue-webrtc': WebRTC, 'offer-option': OfferOption },
  data() {
    return {
      roomId: 'webstreamer/123',
      server: 'http://localhost:9001/'
    }
  },
  methods: {
    join() {
      console.log("-------------------------------")
      console.log(this.$refs.offerRecv.options)
      console.log(this.$refs.offerSend.options)
      console.log('arrary.some', typeof this.$refs.offerSend, '!', this.$refs.offerSend[0],'# ', this.$refs.offerSend.some)
      this.$refs.webrtc.config({
        server: this.server,
        roomId: this.roomId,
        constraints: {
          audio: this.$refs.offerRecv.options.some(val=> val=='audio'),
          video: this.$refs.offerRecv.options.some(val=> val=='video')
        },
        session: {
          audio: this.$refs.offerSend.options.some(val=> val=='audio'),
          video: this.$refs.offerSend.options.some(val=> val=='video')
        }})

      this.$refs.webrtc.join()
    },
    leave() {
      this.$refs.webrtc.leave()
    },
    onWebRTCError() {
      console.log('onWebRTCError')
    }
  }
}
</script>

