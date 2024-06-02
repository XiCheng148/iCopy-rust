<script setup lang="ts">
import { ref, onMounted, watch, computed, nextTick } from 'vue';
import Item from '../item/index.vue';
import { useDexie } from '../../utils/db.js';
import { useClipboard } from '../../utils/clipboard.js';
import { writeText, writeImageBase64 } from 'tauri-plugin-clipboard-api';
import { useVirtualList } from '@vueuse/core';
import { appWindow } from '@tauri-apps/api/window';

const { clipboardList, fetchList } = useDexie();
const { hasNew } = useClipboard();

// const filterList = computed(()=>(clipboardList.value.filter((item: any) => item.type == 'img')));
const { list, containerProps, wrapperProps, scrollTo } = useVirtualList<any>(
  clipboardList,
  {
    itemWidth: 250,
    overscan: 1,
  }
);

const scrollContainer = ref();
const index = ref(0);
const copy = async (item: any) => {
  try {
    if (item.type !== 'img') {
      writeText(item.content);
    } else if (item.type === 'img') {
      writeImageBase64(item.content);
    }
    await appWindow.hide();
  } catch (error) {
    console.error('error------', error);
  }
};

const handleWheel = event => {
  if (scrollContainer.value) {
    event.preventDefault(); // 阻止默认的垂直滚动行为
    if (event.deltaY > 0) {
      if (index.value <= clipboardList.value.length - 9) index.value += 1;
    } else {
      if (index.value !== 0) index.value -= 1;
    }
    scrollTo(index.value);
  }
};

watch(hasNew, async () => {
  if (hasNew.value) {
    await fetchList();
    hasNew.value = false;
  }
});

onMounted(async () => {
  await fetchList();
  if (scrollContainer.value) {
    scrollContainer.value.addEventListener('wheel', handleWheel);
  }
});
</script>

<template>
  <div v-bind="containerProps" class="p-4 pt-1 flex-grow">
    <div v-bind="wrapperProps" class="gap-x-16px" ref="scrollContainer">
      <!-- <pre>{{ list }}</pre> -->
      <Item
        v-for="item in list"
        :key="item.data.id"
        :item="item.data"
        @copy="copy"
      />
    </div>
  </div>
</template>
