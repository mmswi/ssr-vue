<template>
    <div>
      <h1>The item is</h1>
        <div v-if="item">{{item.title}}</div>
        <div v-else>...</div>
    </div>
</template>

<script>
export default {
  computed: {
    item() {
      return this.$store.state.items[this.$route.params.id];
    }
  },

  // Server-side only
  // This will be called by the server renderer automatically
  serverPrefetch() {
    // return the Promise from the action
    // so that the component waits before rendering
    return this.fetchItem();
  },

  // Client-side only
  mounted() {
    // If we didn't already do it on the server
    // we fetch the item (will first show the loading text)
    if (!this.item) {
      this.fetchItem();
    }
  },

  methods: {
    fetchItem() {
      console.log("dispatching fetchitem");
      return this.$store.dispatch("fetchItem", this.$route.params.id);
    }
  }
};
</script>

<style scoped>
</style>