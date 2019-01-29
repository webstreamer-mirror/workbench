<template>
  <div class="app-container">
    <div class="filter-container">
      {{ title }}
      <el-checkbox-group v-model="checkboxVal">
        <el-checkbox label="audio">audio</el-checkbox>
        <el-checkbox label="video">video</el-checkbox>
      </el-checkbox-group>
    </div>
  </div>
</template>

<script>
const defaultOptions = ["audio", "video"];

export default {
  props: {
    title: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      options: ["audio", "video"],
      checkboxVal: defaultOptions // checkboxVal
    };
  },
  watch: {
    checkboxVal(valArr) {
      this.options = this.options.filter(i => valArr.indexOf(i) >= 0);
      this.$emit("change", this.options);
    }
  }
};
</script>

