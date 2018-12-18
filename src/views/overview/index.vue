<template>
  <div class="app-container">
    <vue-markdown>The time of **NOW** is :</vue-markdown><vue-markdown :source="source"></vue-markdown>
    <vue-markdown :anchor-attributes="anchorAttrs">[click here, start vue-markdown project in new page](https://github.com/miaolz123/vue-markdown)</vue-markdown>
  </div>
</template>
<script>
import VueMarkdown from 'vue-markdown'
export default {
  name: 'Overview',
  components: { VueMarkdown },
  data() {
    return {
        source: new Date().toLocaleTimeString(),
        anchorAttrs: {
          target: '_blank',
          rel: 'noopener noreferrer nofollow'
        }
      }
    },
  mounted () {
    setInterval(() => {
      this.source = new Date().toLocaleTimeString();
    }, 1000);
  }
}
</script>
