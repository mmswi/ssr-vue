1. The server renders a string with createRenderer
   1.1 The string is the bundled app

2. On components, we use serverPrefetch and check in mounted (clientside) if the data is available else fetch it
   serverPrefetch() {
   return this.fetchItem();
   },
   mounted() {
   if (!this.item) {
   this.fetchItem();
   }
   }
