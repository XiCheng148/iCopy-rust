<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
// import Item from '../item/index.vue';
import { useDexie } from '../../utils/db.js';
import { useClipboard } from '../../utils/clipboard.js';
const { add, list, fetchList } = useDexie();
const { hasNew, monitorRunning } = useClipboard();
watch(hasNew, async () => {
  console.log('hasNew', hasNew);
});
onMounted(async () => {
  await fetchList();
});
</script>

<template>
  <div>
    {{ monitorRunning }}
    <v-virtual-scroll :items="list" height="100%">
      <template v-slot:default="{ item }">
        <v-card variant="tonal" class="mb-8 !p-2" v-ripple>
          <div v-if="item" class="text-ellipsis text-left">
            {{ item.content }}
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
  </div>
</template>
