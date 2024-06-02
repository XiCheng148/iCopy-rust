<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import List from './components/list/index.vue';
import { appWindow, PhysicalSize } from '@tauri-apps/api/window';
import { primaryMonitor } from '@tauri-apps/api/window';
import { useStorage } from '@vueuse/core';
import { useDexie } from './utils/db';

const setWindowSize = async () => {
  const monitor = await primaryMonitor();
  if (monitor) {
    const { width } = monitor.size;
    console.log('window size: ', width, Math.floor(width / 7));
    await appWindow.setSize(new PhysicalSize(width, Math.floor(width / 7))); // 设置宽度为 800，高度为屏幕工作区高度
  }
};
const tagClick = () => {
  console.log('todo tagClick');
};

const hideWindowWithEscape = async (e: any) => {
  if (e.key === 'Escape') {
    // 使用 Tauri API 隐藏窗口
    appWindow.hide();
  }
};

const monitorRunning = useStorage('monitorRunning', false);

const { exportData, importData } = useDexie();

onMounted(async () => {
  await setWindowSize();
  window.addEventListener('keyup', e => {
    hideWindowWithEscape(e);
  });
});
</script>

<template>
  <div class="h-100vh flex flex-col rounded-xl bg-dark/80">
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
    <div
      :class="['flex gap-x-8 select-none p-2 justify-between', 'text-white/90']"
    >
      <div class="flex gap-x-10px">
        <div
          class="w-14px h-14px rounded-full cursor-pointer"
          :class="monitorRunning ? 'bg-green' : 'bg-[#f00]'"
        ></div>
      </div>
      <!-- search -->
      <div class="flex gap-x-8">
        <div class="cursor-pointer hover:text-green" @click="tagClick">
          搜索
        </div>
        <div class="cursor-pointer hover:text-green" @click="tagClick">
          全部
        </div>
        <div class="cursor-pointer hover:text-green" @click="tagClick">
          收藏
        </div>
        <div class="cursor-pointer hover:text-green" @click="tagClick">
          标签
        </div>
        <div class="cursor-pointer hover:text-green" @click="tagClick">
          号码
        </div>
      </div>
      <div>
        <img
          class="w-24px h-24px rounded-full cursor-pointer"
          @click="exportData"
          src="./assets/svg/export.svg"
        />
        <img
          class="w-24px h-24px rounded-full cursor-pointer"
          @click="importData"
          src="./assets/svg/import.svg"
        />
      </div>
    </div>
    <List class="flex-grow" />
  </div>
</template>
