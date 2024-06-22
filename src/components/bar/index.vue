<script lang="ts" setup>
import { ref } from 'vue';

defineProps({
  monitorRunning: Boolean,
});
const keyWord = defineModel();
const blur = (event: any) => {
  keyWord.value = event.target.value;
};
// todo 待完善
const typeList = ref(['全部', '文本', '图片', '收藏']);

// 主题切换
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

const searchHandler = () => {};

const tagClick = () => {
  console.log('tagClick');
};
</script>

<template>
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
      <div class="cursor-pointer hover:text-green flex gap-x-6px">
        <span>🔍</span>
        <input
          type="text"
          @blur="blur"
          :class="[
            'border-none rounded-4px outline-none ring-2 ring-[var(--border)] p-0 px-2',
            'bg-transparent h-full',
            'focus:ring-green hover:ring-blue transition-all',
          ]"
          @keydown.enter="searchHandler"
        />
      </div>
      <div
        v-for="item in typeList"
        class="cursor-pointer hover:text-green"
        @click="tagClick"
      >
        {{ item }}
      </div>
    </div>
    <div class="flex gap-x-8px">
      <img
        class="w-24px h-24px rounded-full cursor-pointer"
        @click="
          () => {
            // exportData
          }
        "
        src="../../assets/svg/export.svg"
      />
      <img
        class="w-24px h-24px rounded-full cursor-pointer"
        @click="
          () => {
            // importData
          }
        "
        src="../../assets/svg/import.svg"
      />
      <div class="" @click="toggleTheme">
        {{ isLight ? '🌞' : '🌜' }}
      </div>
    </div>
  </div>
</template>
