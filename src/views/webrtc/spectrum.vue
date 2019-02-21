<template>
  <div class="app-container">
    <label>Audio Spectrum&emsp;
      <el-button
        style="margin-bottom:20px;"
        type="primary"
        icon="spectrum"
        @click="run_test"
      >Test source</el-button>
    </label>

    <br>
    <canvas id="freq" width="400" height="255"></canvas>&emsp;
    <canvas id="time" width="400" height="255"></canvas>
    <br>
  </div>
</template>

<script>
export default {
  name: "spectrum",
  components: {},
  data() {
    return {
      audioCtx: null,
      source: null,
      analyzer: null,
      time_data: null,
      freq_data: null
    };
  },
  mounted() {
    this.audioCtx = new AudioContext();
    this.analyser = this.audioCtx.createAnalyser();
    this.analyser.fftSize = 2048;
    this.analyser.maxDecibels = -1;
  },
  methods: {
    run_test() {
      let self = this;
      if (navigator.mediaDevices) {
        console.log("getUserMedia supported.");
        navigator.mediaDevices
          .getUserMedia({ audio: true, video: false })
          .then(function(stream) {
            let source = self.audioCtx.createMediaStreamSource(stream);
            self.analyze_spectrum(source);
          })
          .catch(err => {
            console.log("----error-----");
            console.log(err.message);
          });
      }
      //   var real = new Float32Array(2);
      //   var imag = new Float32Array(2);
      //   var osc = this.audioCtx.createOscillator();
      //   real[0] = 0;
      //   imag[0] = 0;
      //   real[1] = 1;
      //   imag[1] = 0;
      //   var wave = this.audioCtx.createPeriodicWave(real, imag, {
      //     disableNormalization: true
      //   });
      //   osc.setPeriodicWave(wave);

      //   osc.start();
      //   this.analyze_spectrum(osc);
    },
    run_analyze(stream) {
      console.log(stream);
      console.log(stream.getAudioTracks());
    //   stream = new window.webkitMediaStream(stream.getAudioTracks());

      let source = this.audioCtx.createMediaStreamSource(stream);
      this.analyze_spectrum(source);
    },
    analyze_spectrum(source) {
      this.source = source;
      this.source.connect(this.analyser);
      this.analyser.connect(this.audioCtx.destination);

      var bufferLength = this.analyser.frequencyBinCount;
      this.time_data = new Uint8Array(bufferLength);
      this.freq_data = new Uint8Array(bufferLength);
      requestAnimationFrame(this.draw_freq);
      requestAnimationFrame(this.draw_time);
    },
    draw_time() {
      var bufferLength = this.analyser.frequencyBinCount;
      let canvas = document.getElementById("time");
      var ctx = canvas.getContext("2d");

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      this.analyser.getByteTimeDomainData(this.time_data);

      ctx.fillStyle = "rgb(0, 0, 0)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      var barWidth = (canvas.width / bufferLength) * 2.5;
      var barHeight;
      var x = 0;

      for (var i = 0; i < bufferLength; i++) {
        barHeight = this.time_data[i];

        ctx.fillStyle = "rgb(" + barHeight + ",50,50)";
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

        x += barWidth;
      }
      //   console.log("-----time----");
      //   console.log(this.time_data);
      //   let self = this;
      //   setTimeout(() => {
      //     let drawVisual = requestAnimationFrame(self.draw_time);
      //   }, 1000);
      let drawVisual = requestAnimationFrame(this.draw_time);
    },
    draw_freq() {
      var bufferLength = this.analyser.frequencyBinCount;
      let canvas = document.getElementById("freq");
      var ctx = canvas.getContext("2d");

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      this.analyser.getByteFrequencyData(this.freq_data);

      ctx.fillStyle = "rgb(0, 0, 0)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      var barWidth = (canvas.width / bufferLength) * 2.5;
      var barHeight;
      var x = 0;

      for (var i = 0; i < bufferLength; i++) {
        barHeight = this.freq_data[i];

        ctx.fillStyle = "rgb(" + barHeight + ",50,50)";
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

        x += barWidth;
      }
      let drawVisual = requestAnimationFrame(this.draw_freq);
    }
  }
};
</script>

