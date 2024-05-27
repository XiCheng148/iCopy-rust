<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
// import Item from '../item/index.vue';
import { useDexie } from '../../utils/db.js';
import { useClipboard } from '../../utils/clipboard.js';
import { writeText, writeImageBase64 } from 'tauri-plugin-clipboard-api';

const { list, fetchList } = useDexie();
const { hasNew, monitorRunning, unlistenClipboard } = useClipboard();

watch(hasNew, async () => {
  if (hasNew.value) {
    await fetchList();
    hasNew.value = false;
  }
});

const isTwice = ref(0);
const snackbar = ref({
  isShow: false,
  text: '',
});

const copy = async (item: any) => {
  isTwice.value++;
  if (isTwice.value === 2) {
    isTwice.value = 0;
    try {
      if (item.type !== 'img') {
        writeText(item.content);
      } else if (item.type === 'img') {
        writeImageBase64(item.content);
      }
      snackbar.value.isShow = true;
      snackbar.value.text = '已复制到剪切板';
    } catch (error) {
      console.error('error------', error);
    }
  }
};

onMounted(async () => {
  await fetchList();
});
</script>

<template>
  <div>
    {{ monitorRunning ? '已启动' : '未启动！！' }}
    <v-virtual-scroll :items="list" height="100%" item-height="200">
      <template v-slot:default="{ item }">
        <div
          v-ripple
          :class="[
            'first:mt-2 mb-4 !p-2 bg-slate-800 text-xl h-200px',
            'flex',
            item.type === 'img' ? 'justify-center items-center' : '',
            'ring-1 ring-inset ring-white/10 rounded-lg shadow-xl',
            'transition-all hover:-translate-y-1',
            'overflow-hidden',
            'select-none'
          ]"
          @click="copy(item)"
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
    <v-snackbar
      v-model="snackbar.isShow"
      :timeout="2000"
      color="blue-grey"
      rounded="pill"
      max-width="100"
    >
      {{ snackbar.text }}
    </v-snackbar>
    {{ monitorRunning ? '已启动' : '未启动！！' }}
  </div>
</template>
