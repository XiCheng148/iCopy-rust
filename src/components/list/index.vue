<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import Item from '../item/index.vue';
import { ItemType, useClipboard } from '../../utils/clipboard.js';
import { writeText, writeImageBase64 } from 'tauri-plugin-clipboard-api';
import { appWindow } from '@tauri-apps/api/window';
import { useClipboardStore } from '../../store/useClipboard';
import { storeToRefs } from 'pinia';
import {
  isPermissionGranted,
  requestPermission,
  sendNotification,
} from '@tauri-apps/api/notification';
import { dialog } from '@tauri-apps/api';

const { hasNew } = useClipboard();
const clipboardStore = useClipboardStore();
const { query: fetchList, deleteById } = clipboardStore;
const { list: clipboardList, loading } = storeToRefs(clipboardStore);

const permissionGranted = ref(false);
const scrollContainer = ref();

const index = ref(0);
const copy = async (item: any) => {
  try {
    if (item.item_type !== ItemType.IMAGE) {
      await writeText(item.content);
    } else if (item.item_type === ItemType.IMAGE) {
      await writeImageBase64(item.content);
    }
    if (permissionGranted.value) {
      sendNotification({
        icon: 'icons/icon-64.ico',
        title: `🎉🎉🎉 复制成功!`,
        body: item.item_type === ItemType.IMAGE ? '' : `${item.content}`,
      });
    }
    await appWindow.hide();
  } catch (error) {
    dialog.message('复制失败', JSON.stringify(error as any));
  }
};
const del = async (id: number) => {
  try {
    await deleteById({ id });
    if (permissionGranted) {
      sendNotification({
        icon: 'icons/icon-64.ico',
        title: '❎ 删除成功!',
      });
    }
  } catch (error) {
    dialog.message('删除失败', JSON.stringify(error as any));
  }
};

// 滚动监听
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
    hasNew.value = false;
  }
});

onMounted(async () => {
  if (scrollContainer.value) {
    scrollContainer.value.$el.addEventListener('wheel', handleWheel);
  }
  permissionGranted.value = await isPermissionGranted();
  if (!permissionGranted.value) {
    const permission = await requestPermission();
    permissionGranted.value = permission === 'granted';
  }
  await fetchList();
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
