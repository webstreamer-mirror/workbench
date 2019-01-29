<template>
  <div class="video-list">
    <!-- <script src="https://cdn.jsdelivr.net/gh/naptha/tesseract.js@v1.0.14/dist/tesseract.min.js"></script> -->
    <div v-for="item in videoList" v-bind:video="item" v-bind:key="item.id" class="video-item">
      <video
        controls
        autoplay
        playsinline
        :srcObject.prop="item.srcObject"
        :muted="item.muted"
        :id="item.id"
      ></video>
    </div>
    <div id="ocr_results"></div>
    <div id="ocr_status"></div>
  </div>
</template>

<script>
// src =  "https://cdn.jsdelivr.net/gh/naptha/tesseract.js@v1.0.14/dist/tesseract.min.js";
var RTCMultiConnection = require("rtcmulticonnection");
var Tesseract = require("tesseract.js");
// var Tesseract = require("https://cdn.jsdelivr.net/gh/naptha/tesseract.js@v1.0.14/dist/tesseract.min.js");
// import Tesseract from "https://cdn.jsdelivr.net/gh/naptha/tesseract.js@v1.0.14/dist/tesseract.min.js";

export default {
  name: "vue-webrtc",
  components: {
    RTCMultiConnection
  },
  data() {
    return {
      rtcmConnection: null,
      localVideo: null,
      videoList: [],
      canvas: null,
      sessionId: "webstreamer/public-room"
    };
  },
  props: {
    roomId: {
      type: String,
      default: "public-room"
    },
    socketURL: {
      type: String,
      default: "http://localhost:9001/"
    },
    cameraHeight: {
      type: [Number, String],
      default: 160
    },
    autoplay: {
      type: Boolean,
      default: true
    },
    screenshotFormat: {
      type: String,
      default: "image/jpeg"
    }
  },
  watch: {},
  mounted() {
    var that = this;
    this.sessionId = this.roomId;
    this.rtcmConnection = new RTCMultiConnection();
    this.rtcmConnection.socketURL = this.socketURL;
    this.rtcmConnection.socketMessageEvent = "video-conference-demo";

    this.rtcmConnection.session = {
      audio: true,
      video: true
    };
    this.rtcmConnection.sdpConstraints.mandatory = {
      OfferToReceiveAudio: true,
      OfferToReceiveVideo: true
    };
    this.rtcmConnection.onstream = function(event) {
      event.mediaElement.src = event.mediaElement.srcObject = null;
      let video = {
        id: event.streamid,
        srcObject: event.stream,
        muted: event.type === "local"
      };
      if (!video.muted) that.videoList.push(video);
      if (event.type === "local") {
        that.localVideo = video;
      }
      that.$emit("joined-room", video);
    };
    this.rtcmConnection.onstreamended = function(event) {
      var newList = [];
      that.videoList.forEach(function(item) {
        if (item.id !== event.streamid) {
          newList.push(item);
        }
      });
      that.videoList = newList;
      that.$emit("left-room", event.streamid);
    };
  },
  methods: {
    join() {
      var that = this;
      this.rtcmConnection.openOrJoin(this.sessionId, function(
        isRoomExist,
        roomid
      ) {
        if (isRoomExist === false && that.rtcmConnection.isInitiator === true) {
          that.$emit("opened-room", roomid);
        }
      });
    },
    leave() {
      this.rtcmConnection.attachStreams.forEach(function(localStream) {
        localStream.stop();
      });
      this.rtcmConnection.close();
      this.videoList = [];
    },
    capture() {
      const dataUrl = this.getCanvas().toDataURL(this.screenshotFormat);
      //   let image = new Image();
      //   image.src = dataUrl;
      //   image.crossOrigin = "Anonymous";

      //   const canvas = document.getElementById("canvas");
      //   let self = this;
      //   image.onload = () => {
      //     canvas.width = image.width;
      //     canvas.height = image.height;

      //     let ctx = canvas.getContext("2d");
      //     ctx.drawImage(image, 0, 0);

      //     let src = ctx.getImageData(0, 0, canvas.width, canvas.height);
      //     self.runOCR(src);
      //     runOCR;
      //   };
      return dataUrl;
    },
    getCanvas() {
      let video = document.getElementById(this.videoList[0].id);
      //   console.log(video.currentTime);
      //   console.log(video);
      //   console.log(new Date());
      let canvas = document.createElement("canvas");
      canvas.height = video.videoHeight;
      canvas.width = video.videoWidth;

      var ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      let data = ctx.getImageData(0, 0, canvas.width, canvas.height);
      console.log(data);
      Tesseract.recognize(data)
        .then(function(result) {
          document.getElementById("ocr_results").innerText = result.text;
        })
        .progress(function(result) {
          document.getElementById("ocr_status").innerText =
            result["status"] + " (" + result["progress"] * 100 + "%)";
        });
      return canvas;
    },
    runOCR(image) {
      Tesseract.recognize(image)
        .then(function(result) {
          document.getElementById("ocr_results").innerText = result.text;
        })
        .progress(function(result) {
          document.getElementById("ocr_status").innerText =
            result["status"] + " (" + result["progress"] * 100 + "%)";
        });
    },
    getCurrentVideo() {
      const video = document.getElementById("video");
      return video;
      //   if (this.localVideo === null) {
      //     return null;
      //   }
      //   for (var i = 0, len = this.$refs.videos.length; i < len; i++) {
      //     if (this.$refs.videos[i].id === this.localVideo.id)
      //       return this.$refs.videos[i];
      //   }
      //   return null;
    },
    config(options) {
      console.log("webrtc config: ", options);
      if (options.server) {
        this.rtcmConnection.socketURL = options.server;
      }

      if (options.roomId) {
        this.sessionId = options.roomId;
      }

      if (options.constraints) {
        this.rtcmConnection.sdpConstraints.mandatory = {
          OfferToReceiveAudio: options.constraints.audio || false,
          OfferToReceiveVideo: options.constraints.video || false
        };
      }
      if (options.session) {
        this.rtcmConnection.session = {
          audio: options.session.audio || false,
          video: options.session.video || false
        };
      }
    }
  }
};
</script>
<style scoped>
.video-list {
  background: whitesmoke;
  height: auto;
}

.video-list div {
  padding: 0px;
}

.video-item {
  background: #c5c4c4;
  display: inline-block;
}
</style>
