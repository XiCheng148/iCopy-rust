<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
// import Item from '../item/index.vue';
import { useDexie } from '../../utils/db.js';
import { useClipboard } from '../../utils/clipboard.js';
import { writeText, writeImageBase64 } from 'tauri-plugin-clipboard-api';
import { useVirtualList } from '@vueuse/core';

const { clipboardList, fetchList } = useDexie();

// const filterList = computed(()=>(clipboardList.value.filter((item: any) => item.type == 'img')));
const { list, containerProps, wrapperProps } = useVirtualList<any>(
  clipboardList,
  {
    itemWidth: 250,
    overscan: 1,
  }
);
const { hasNew, monitorRunning } = useClipboard();

watch(hasNew, async () => {
  if (hasNew.value) {
    await fetchList();
    hasNew.value = false;
  }
});

const snackbar = ref({
  isShow: false,
  text: '',
});

const copy = (item: any) => {
  console.log('触发');
  try {
    if (item.data.type !== 'img') {
      writeText(item.data.content);
    } else if (item.data.type === 'img') {
      writeImageBase64(item.data.content);
    }
    snackbar.value.isShow = true;
    snackbar.value.text = '已复制到剪切板';
  } catch (error) {
    console.error('error------', error);
  }
};
// document.getElementById('scroll-container').addEventListener('wheel', function(event) {
//   if (event.deltaY == 0) return; // 如果没有垂直滚动，则不做任何操作
//   event.preventDefault(); // 阻止垂直滚动
//   this.scrollLeft += event.deltaY + event.deltaX; // 将垂直滚动值应用于水平滚动
// });

onMounted(async () => {
  await fetchList();
});
</script>

<template>
  <div class="flex flex-col">
    <div
      class="ml-1 w-10px h-10px rounded-full"
      :class="monitorRunning ? 'bg-green' : 'bg-[#f00]'"
    ></div>
    <div v-bind="containerProps" class="p-4 pt-1 flex-grow">
      <div
        v-bind="wrapperProps"
        class="gap-x-16px"
      >
        <!-- <pre>{{ list }}</pre> -->
        <div
          v-for="item in list"
          :class="[
            ' bg-slate-800 text-xl w-200px p-2',
            'flex  overflow-hidden text-truncate text-ellipsis',
            item.data.type === 'img' ? 'justify-center items-center' : '',
            'ring-1 ring-inset ring-white/10 rounded-lg shadow-xl',
            'transition-all hover:-translate-y-1',
            'select-none',
          ]"
          @click="copy(item)"
        >
          {{ item.data.type !== 'img' ? item.data.content : '' }}
          <div
            v-if="item.data.type === 'img'"
            class="w-full h-full bg-contain bg-no-repeat bg-center"
            :style="{
              'background-image': `url(data:image/jpg;base64,${item.data.content})`,
            }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>
