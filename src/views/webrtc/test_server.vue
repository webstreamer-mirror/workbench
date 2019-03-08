<template>
  <div class="app-container">
    <label>Rtsp Test Server
      <el-button
        style="margin-bottom:20px;"
        type="primary"
        icon="rtsp_test_server"
        @click="create_rtsp_test_server"
      >Create</el-button>
      <el-button
        style="margin-bottom:20px;"
        type="primary"
        icon="rtsp_test_server"
        @click="destroy_rtsp_test_server"
      >Destroy</el-button>

      <br>id : &emsp;
      <el-input v-model="rtsp_test_server.id" style="width:100px;"/>&emsp;port : &emsp;
      <el-input v-model="rtsp_test_server.port" style="width:100px;"/>&emsp;path : &emsp;
      <el-input v-model="rtsp_test_server.path" style="width:100px;"/>&emsp;video : &emsp;
      <el-input v-model="rtsp_test_server.video" style="width:100px;"/>&emsp;audio : &emsp;
      <el-input v-model="rtsp_test_server.audio" style="width:100px;"/>
    </label>
    <br>
    <br>
  </div>
</template>

<script>
export default {
  name: "spectrum",
  components: {},
  data() {
    return {
      rtsp_test_server: {
        id: "app0",
        port: 8554,
        path: "/test",
        video: "h264",
        audio: "pcma"
      }
    };
  },
  mounted() {},
  methods: {
    async create_rtsp_test_server() {
      let res = await this.$store.dispatch(
        "CreateRtspTestServer",
        this.rtsp_test_server
      );
      console.log("--------");
      console.log(res);
    },
    async destroy_rtsp_test_server() {
      let res = await this.$store.dispatch(
        "DestroyRtspTestServer",
        this.rtsp_test_server.id
      );
    }
  }
};
</script>

