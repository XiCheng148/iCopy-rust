<script setup lang="ts">
import { ref } from 'vue';
// import Item from '../item/index.vue';
const list = ref([]);
list.value = Array.from(
  { length: 100 },
  (k, v) => `第 ${v + 1} 项..............`
);
</script>

<template>
  <v-virtual-scroll :items="list" height="100%">
    <template v-slot:default="{ item }">
      <v-card variant="tonal" class="mb-8 !p-2" v-ripple>
        <div v-if="item" class="text-ellipsis text-left">
          {{ item }}
        </div>
        <img
          v-else
          class="h-60px"
          src="https://weremit-static.tenpay.com/upload-static/tgb/p2BE2942LoBcdQMjw2MFzj-5oS5Zu.png"
          alt=""
        />
      </v-card>
    </template>
  </v-virtual-scroll>
</template>
