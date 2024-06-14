<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue';
import List from './components/list/index.vue';
import { appWindow, PhysicalSize } from '@tauri-apps/api/window';
import { primaryMonitor } from '@tauri-apps/api/window';
import { useStorage } from '@vueuse/core';
import { useClipboardStore } from './store/useClipboard';

const clipboardStore = useClipboardStore();
const { search, query } = clipboardStore;
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

const keyword = ref('');

const searchHandler = () => {
  search({ keyword: keyword.value });
};

const hideWindowWithEscape = async (e: any) => {
  if (e.key === 'Escape') {
    // 使用 Tauri API 隐藏窗口
    await appWindow.hide();
  }
};

const monitorRunning = useStorage('monitorRunning', false);

const isLight = ref(true);
const toggleTheme = (e: any) => {
  isLight.value = !isLight.value;
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.style.setProperty('--x', e.clientX + 'px');
  document.documentElement.style.setProperty('--y', e.clientY + 'px');
  if ((document as any).startViewTransition) {
    (document as any).startViewTransition(() => {
      document.documentElement.setAttribute('data-theme', newTheme);
    });
  } else {
    document.documentElement.setAttribute('data-theme', newTheme);
  }
};

watch(keyword, async newVal => {
  if (!newVal) {
    await query();
  }
});

onMounted(async () => {
  await setWindowSize();
  window.addEventListener('keyup', e => {
    hideWindowWithEscape(e);
  });
});
</script>

<template>
  <div
    class="h-100vh flex flex-col rounded-xl bg-[var(--bg)]"
    :class="[
      // 'transition-all duration-[var(--duration)] delay-[var(--dealy)]'
    ]"
  >
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
        <div class="cursor-pointer hover:text-green">
          🔍
          <input
            type="text"
            placeholder="搜索"
            v-model="keyword"
            @keydown.enter="searchHandler"
          />
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
      <div class="flex gap-x-8px">
        <img
          class="w-24px h-24px rounded-full cursor-pointer"
          @click="
            () => {
              //exportData
            }
          "
          src="./assets/svg/export.svg"
        />
        <img
          class="w-24px h-24px rounded-full cursor-pointer"
          @click="
            () => {
              // importData
            }
          "
          src="./assets/svg/import.svg"
        />
        <div class="" @click="toggleTheme">
          {{ isLight ? '🌞' : '🌜' }}
        </div>
      </div>
    </div>
    <List class="flex-grow" />
  </div>
</template>
