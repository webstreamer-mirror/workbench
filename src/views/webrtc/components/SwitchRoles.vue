<template>
  <div style="display:inline-block;">
    <label class="radio-label">call mode: </label>
    <el-radio-group v-model="autoWidth">
      <el-radio :label="true" border>open</el-radio>
      <el-radio :label="false" border>join</el-radio>
    </el-radio-group>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    autoWidth: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  }
}
</script>
