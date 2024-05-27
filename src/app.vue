<script setup lang="ts">
import { onMounted } from 'vue';
import List from './components/list/index.vue';
import { LogicalSize, appWindow } from '@tauri-apps/api/window';
import { primaryMonitor } from '@tauri-apps/api/window';

async function setWindowToMaxHeight() {
  const monitor = await primaryMonitor();
  if (monitor) {
    const { height } = monitor.size;
    console.log('height: ', height);
    await appWindow.setSize(new LogicalSize(350, height)); // 设置宽度为 800，高度为屏幕工作区高度
  }
}

onMounted(async () => {
  await setWindowToMaxHeight();
});
</script>

<template>
  <div class="m-4 w-100vw mx-auto px-4">
    <!-- 搜索🔍 -->
    <!-- <v-text-field clearable>
      <template v-slot:prepend>
        <img
          class="w-40px h-40px ml-20px"
          src="https://weremit-static.tenpay.com/upload-static/tgb/x844gH2dTxV3lyJ1Omj5zE-vector.svg"
          alt=""
        />
      </template>
    </v-text-field> -->
    <List class="w-full" />
  </div>
</template>
