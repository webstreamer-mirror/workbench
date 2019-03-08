<template>
  <div class="video-list">
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
  </div>
</template>

<script>
var RTCMultiConnection = require("rtcmulticonnection");

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
      default: "http://192.168.199.128:9001/"
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
      video: true,
      oneway: false
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
      if (event.type === "local") {
        that.localVideo = video;
      } else {
        that.videoList.push(video);
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
      this.rtcmConnection.closeSocket();
      this.videoList = [];
    },
    capture(canvas) {
      if (!canvas) {
        canvas = this.getCanvas();
      }
      const dataUrl = canvas.toDataURL(this.screenshotFormat);

      //   let ctx = canvas.getContext("2d");
      //   let src = ctx.getImageData(0, 0, canvas.width, canvas.height);
      //   this.runOCR(src, canvas);

      return dataUrl;
    },
    getCanvas() {
      let video = document.getElementById(this.videoList[0].id);

      let canvas = document.createElement("canvas");
      canvas.height = video.videoHeight;
      canvas.width = video.videoWidth;

      var ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      return canvas;
    },
    get_mediastream() {
      if (this.videoList.length) {
        let video = document.getElementById(this.videoList[0].id);
        let stream = this.videoList[0].srcObject;
        return stream;
      }
      return null;
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
          video: options.session.video || false,
          oneway: options.session.oneway || false
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
