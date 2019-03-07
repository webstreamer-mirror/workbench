<template>
  <div class="app-container">
    <test-server ref="test-server" width="100%"/>
    <br>
    <label>Livestream
      <el-button
        style="margin-bottom:20px;"
        type="primary"
        icon="livestream"
        @click="create_livestream"
      >Create</el-button>
      <el-button
        style="margin-bottom:20px;"
        type="primary"
        icon="livestream"
        @click="startup_livestream"
      >StartUp</el-button>
      <el-button
        style="margin-bottom:20px;"
        type="primary"
        icon="livestream"
        @click="stop_livestream"
      >Stop</el-button>
      <el-button
        style="margin-bottom:20px;"
        type="primary"
        icon="livestream"
        @click="destroy_livestream"
      >Destroy</el-button>
      <br>id : &emsp;
      <el-input v-model="livestream.id" style="width:100px;"/>&emsp;url : &emsp;
      <el-input v-model="livestream.url" style="width:300px;"/>&emsp;video : &emsp;
      <el-input v-model="livestream.video" style="width:100px;"/>&emsp;audio : &emsp;
      <el-input v-model="livestream.audio" style="width:100px;"/>
    </label>
    <br>
    <br>

    <label>Audience</label>
    <br>
    <label>RTSP
      <el-button
        style="margin-bottom:20px;"
        type="primary"
        icon="livestream"
        @click="add_rtsp_audience"
      >Add</el-button>
      <el-button
        style="margin-bottom:20px;"
        type="primary"
        icon="livestream"
        @click="remove_rtsp_audience"
      >Remove</el-button>
      <br>name : &emsp;
      <el-input v-model="rtsp_audience.name" style="width:100px;"/>&emsp;port : &emsp;
      <el-input v-model="rtsp_audience.option.port" style="width:100px;"/>&emsp;path : &emsp;
      <el-input v-model="rtsp_audience.option.path" style="width:120px;"/>
    </label>
    <br>
    <br>

    <label>WEBRTC
      <el-button
        style="margin-bottom:20px;"
        type="primary"
        icon="livestream"
        @click="add_webrtc_audience"
      >Add</el-button>
      <el-button
        style="margin-bottom:20px;"
        type="primary"
        icon="livestream"
        @click="remove_webrtc_audience"
      >Remove</el-button>
      <el-button
        style="margin-bottom:20px;"
        type="primary"
        icon="livestream"
        @click="capture_image"
      >Capture</el-button>
      <el-button
        style="margin-bottom:20px;"
        type="primary"
        icon="livestream"
        @click="audio_freq"
      >FFT</el-button>
      <br>name : &emsp;
      <el-input v-model="webrtc_audience.name" style="width:100px;"/>&emsp;signal bridge : &emsp;
      <el-input v-model="webrtc_audience.option.signal_bridge" style="width:250px;"/>
    </label>

    <!-- <offer-option ref="offerSend" title="Send"/> -->
    <!-- <offer-option ref="offerRecv" title="Receive"/> -->
    <br>
    <br>
    <!-- <br>
    <el-button style="margin-bottom:20px;" type="primary" icon="webrtc" @click="join">Join</el-button>
    <el-button style="margin-bottom:20px;" type="primary" icon="webrtc" @click="leave">Leave</el-button>-->
    <vue-webrtc ref="webrtc" width="100%" @error="onWebRTCError"/>
    <br>
    <tesseract-ocr ref="tesseract" width="100%"/>
    <br>
    <img :src="snapshot" class="img-responsive">
    <br>
    <audio-spectrum ref="spectrum" width="100%"/>
  </div>
</template>

<script>
import WebRTC from "./components/webrtc";
import OfferOption from "./components/offerOption";
import Spectrum from "./components/spectrum";
import Tesseract from "./components/tesseract";
import TestServer from "./test_server";

export default {
  name: "livestream",
  components: {
    "vue-webrtc": WebRTC,
    "offer-option": OfferOption,
    "audio-spectrum": Spectrum,
    "tesseract-ocr": Tesseract,
    "test-server":TestServer
  },
  data() {
    return {
      livestream: {
        id: "app1",
        url: "rtsp://192.168.199.128:8554/test",
        video: "h264",
        audio: "pcma"
      },
      rtsp_audience: {
        id: "app1",
        name: "audience1",
        option: {
          type: "rtsp",
          port: 8554,
          path: "/test_server"
        }
      },
      webrtc_audience: {
        id: "app1",
        name: "audience2",
        option: {
          type: "webrtc",
          signal_bridge: "http://192.168.199.128:9001/",
          role: "offer",
          connection_id: "1"
        }
      },
      snapshot: null,
      audiofreq: null,
      webstreamer: "http://192.168.199.128:8080",
      roomId: "webstreamer/123",
      server: "http://192.168.199.128:9001/"
    };
  },
  methods: {
    create_livestream() {
      this.$store.dispatch("CreateLivestream", this.livestream);
    },
    destroy_livestream() {
      this.$store.dispatch("DestroyLivestream", this.livestream.id);
    },
    async startup_livestream() {
      await this.$store.dispatch("StartLivestream", this.livestream.id);
    },
    stop_livestream() {
      this.$store.dispatch("StopLivestream", this.livestream.id);
    },
    add_rtsp_audience() {
      this.rtsp_audience.id = this.livestream.id;
      this.$store.dispatch("AddAudience", this.rtsp_audience);
    },
    remove_rtsp_audience() {
      this.rtsp_audience.id = this.livestream.id;
      this.$store.dispatch("RemoveAudience", this.rtsp_audience);
    },
    async add_webrtc_audience() {
      this.webrtc_audience.id = this.livestream.id;
      this.webrtc_audience.option.connection_id = this.webrtc_audience.name;
      await this.$store.dispatch("AddAudience", this.webrtc_audience);
      this.join();
    },
    async remove_webrtc_audience() {
      this.webrtc_audience.id = this.livestream.id;
      await this.$store.dispatch("RemoveAudience", this.webrtc_audience);
      this.leave();
    },
    capture_image() {
      let canvas = this.$refs.webrtc.getCanvas();
      this.snapshot = this.$refs.webrtc.capture(canvas);
      this.$refs.tesseract.runOCR(canvas);
    },
    async audio_freq() {
      let stream = this.$refs.webrtc.get_mediastream();
      this.$refs.spectrum.run_analyze(stream);
    },
    join() {
      this.$refs.webrtc.config({
        server: this.webrtc_audience.option.signal_bridge,
        roomId: this.webrtc_audience.option.connection_id,
        constraints: {
          audio: true,
          video: true
          //   audio: this.$refs.offerRecv.options.some(val => val === "audio"),
          //   video: this.$refs.offerRecv.options.some(val => val === "video")
        }
      });

      this.$refs.webrtc.join();
    },
    leave() {
      this.$refs.webrtc.leave();
    },
    onWebRTCError() {
      console.log("onWebRTCError");
    }
  }
};
</script>

