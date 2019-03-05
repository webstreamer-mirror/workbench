<template>
  <div class="app-container">
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
    <label>Video Process&emsp;
      <br>diameter
      <el-input v-model="diameter" style="width:100px;"/>&emsp;
      <el-button
        style="margin-bottom:20px;"
        type="primary"
        icon="video_process"
        @click="run_test"
      >Test source</el-button>
    </label>

    <br>
    <canvas id="noise_frame" width="400" height="255"></canvas>&emsp;
    <canvas id="filter_frame" width="400" height="255"></canvas>
    <br>
  </div>
</template>

<script>
// import cv from "opencv.js";
export default {
  name: "video_process",
  components: {},
  data() {
    return {
      videoList: [],
      width: 0,
      height: 0,
      noise_src: null,
      filter_dst: null,
      diameter: 9
    };
  },
  mounted() {
    let recaptchaScript = document.createElement("script");
    recaptchaScript.setAttribute(
      "src",
      "http://192.168.199.128:8088/build/opencv.js"
    );
    recaptchaScript.async = true;
    document.head.appendChild(recaptchaScript);

    let self = this;
    if (navigator.mediaDevices) {
      console.log("getUserMedia supported.");
      navigator.mediaDevices
        .getUserMedia({ audio: false, video: true })
        .then(function(stream) {
          let video = {
            id: "local_video",
            srcObject: stream,
            muted: false
          };
          self.videoList.push(video);
        })
        .catch(err => {
          console.log("----error-----");
          console.log(err.message);
        });
    }
  },
  methods: {
    run_test() {
      let video = document.getElementById(this.videoList[0].id);
      this.height = video.videoHeight;
      this.width = video.videoWidth;
      console.log("height: " + this.height);
      console.log("width: " + this.width);

      let noise_frame = document.getElementById("noise_frame");
      noise_frame.height = this.height;
      noise_frame.width = this.width;
      if (!this.noise_src) {
        this.noise_src = new cv.Mat(this.height, this.width, cv.CV_8UC4);
      }
      //   this.draw_noise();

      let filter_frame = document.getElementById("filter_frame");
      filter_frame.height = this.height;
      filter_frame.width = this.width;
      if (!this.filter_dst) {
        this.filter_dst = new cv.Mat(this.height, this.width, cv.CV_8UC4);
      }
      this.draw_filter();
    },
    draw_noise() {
      const FPS = 30;
      let begin = Date.now();

      let video = document.getElementById(this.videoList[0].id);

      let noise_frame = document.getElementById("noise_frame");
      let noise_ctx = noise_frame.getContext("2d");

      noise_ctx.drawImage(video, 0, 0, this.width, this.height);
      this.noise_src.data.set(
        noise_ctx.getImageData(0, 0, this.width, this.height).data
      );
      cv.imshow("noise_frame", this.noise_src);

      let delay = 1000 / FPS - (Date.now() - begin);
      setTimeout(this.draw_noise, delay);
      //   requestAnimationFrame(this.draw_noise);
    },
    draw_filter() {
      const FPS = 30;
      let begin = Date.now();

      let video = document.getElementById(this.videoList[0].id);

      let noise_frame = document.getElementById("noise_frame");
      let noise_ctx = noise_frame.getContext("2d");

      noise_ctx.drawImage(video, 0, 0, this.width, this.height);
      let data = noise_ctx.getImageData(0, 0, this.width, this.height).data;
      this.noise_src.data.set(data);
      //   console.log(data.length);
      let src = new cv.Mat();
      cv.cvtColor(this.noise_src, src, cv.COLOR_RGBA2RGB, 0);
      cv.imshow("noise_frame", this.noise_src);

      // You can try more different parameters
      cv.bilateralFilter(
        src,
        this.filter_dst,
        parseInt(this.diameter),
        75,
        75,
        cv.BORDER_DEFAULT
      );
      cv.imshow("filter_frame", this.filter_dst);

      let delay = 1000 / FPS - (Date.now() - begin);
      console.log(delay);
      setTimeout(this.draw_filter, delay);
      //   requestAnimationFrame(this.draw_filter);
    }
  }
};
</script>

