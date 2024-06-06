<script setup lang="ts">
import { ref, onMounted, watch, computed, nextTick } from 'vue';
import Item from '../item/index.vue';
import { useDexie } from '../../utils/db.js';
import { useClipboard } from '../../utils/clipboard.js';
import { writeText, writeImageBase64 } from 'tauri-plugin-clipboard-api';
// import { useVirtualList } from '@vueuse/core';
import { appWindow } from '@tauri-apps/api/window';

const { clipboardList, fetchList } = useDexie();
const { hasNew } = useClipboard();

// const filterList = computed(()=>(clipboardList.value.filter((item: any) => item.type == 'img')));
// const { list, containerProps, wrapperProps, scrollTo } = useVirtualList<any>(
//   clipboardList,
//   {
//     itemWidth: 197,
//     overscan: 1,
//   }
// );

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
  } catch (error) {}
};
const del = async (item: any) => {
  await fetchList();
};

const handleWheel = (event: any) => {
  if (scrollContainer.value) {
    event.preventDefault(); // 阻止默认的垂直滚动行为
    if (event.deltaY > 0) {
      if (index.value <= clipboardList.value.length) index.value += 1;
    } else {
      if (index.value !== 0) index.value -= 1;
    }
    try {
      scrollContainer.value.scrollToItem(index.value);
    } catch (error) {
      index.value = clipboardList.value.length - 5;
      scrollContainer.value.scrollToItem(index.value);
    }
  }
};

watch(hasNew, async () => {
  if (hasNew.value) {
    await fetchList();
    hasNew.value = false;
  }
});

watch(clipboardList, () => {
  console.log('clipboardList', clipboardList);
});

onMounted(async () => {
  await fetchList();
  if (scrollContainer.value) {
    scrollContainer.value.$el.addEventListener('wheel', handleWheel);
  }
});
</script>

<template>
  <div class="flex">
    <DynamicScroller
      :items="clipboardList"
      :min-item-size="54"
      direction="horizontal"
      class="m-10px mt-0"
      ref="scrollContainer"
    >
      <template #default="{ item, index, active }">
        <DynamicScrollerItem
          :item="item"
          :active="active"
          :size-dependencies="[item.message]"
          :data-index="index"
          :data-active="active"
          class="w-210px pt-10px h-[calc(100%-10px)]"
        >
          <Item :item="item" @copy="copy" @del="del" class="h-full" />
        </DynamicScrollerItem>
      </template>
    </DynamicScroller>
  </div>
</template>

<style scoped></style>
