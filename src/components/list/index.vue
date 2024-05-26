<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
// import Item from '../item/index.vue';
import { useDexie } from '../../utils/db.js';
import { useClipboard } from '../../utils/clipboard.js';
const { list, fetchList } = useDexie();
const { hasNew, monitorRunning } = useClipboard();

watch(hasNew, async () => {
  if (hasNew.value) {
    await fetchList();
    hasNew.value = false;
    console.log('list: ', list);
  }
});

onMounted(async () => {
  await fetchList();
});
</script>

<template>
  <div>
    <v-virtual-scroll :items="list" height="100%" item-height="200">
      <template v-slot:default="{ item }">
        <div
          v-ripple
          :class="[
            'first:mt-2 mb-4 !p-2 bg-slate-800 text-xl h-200px',
            'flex items-center',
            item.type === 'img' ? 'justify-center' : '',
            'ring-1 ring-inset ring-white/10 rounded-lg shadow-xl',
            'transition-all hover:-translate-y-1',
            'overflow-hidden',
            'texx-elipsis',
          ]"
        >
          {{ item.type !== 'img' ? item.content : '' }}
          <div
            v-if="item.type === 'img'"
            class="w-full h-full bg-contain bg-no-repeat bg-center"
            :style="{
              'background-image': `url(data:image/jpg;base64,${item.content})`,
            }"
          ></div>
        </div>
      </template>
    </v-virtual-scroll>
    {{ monitorRunning ? '已启动' : '未启动！！' }}
  </div>
</template>
