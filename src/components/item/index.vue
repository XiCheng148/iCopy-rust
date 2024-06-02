<template>
  <div
    :class="[
      'bg-slate-800 w-200px text-14px leading-18px',
      'flex flex-col justify-between overflow-hidden',
      item.type === 'img' ? 'justify-center items-center' : '',
      'ring-1 ring-inset ring-white/10 rounded-lg shadow-xl',
      'transition-all hover:-translate-y-1',
      'select-none',
    ]"
    @dblclick="copy(item)"
  >
    <div class="line-clamp-5" :class="item.type !== 'img' ? 'm-2' : ''">
      {{ item.type !== 'img' ? item.content : '' }}
    </div>
    <div
      v-if="item.type === 'img'"
      class="w-full h-full bg-contain bg-no-repeat bg-center"
      :style="{
        'background-image': `url(data:image/jpg;base64,${item.content})`,
      }"
    ></div>
    <div
      class="w-full flex justify-between bg-white/10 text-slate-400 line-clamp-1"
    >
      <div class="ml-10px">{{ item.type }}</div>
      <div class="mr-10px">{{ getTimeAgo(item.time) }}</div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useTimeAgo } from '@vueuse/core';
import { PropType, computed } from 'vue';
import { formatTimeAgo } from '@vueuse/core';

defineProps({
  item: {
    type: Object as PropType<{
      type: string;
      content: string;
      time: string;
    }>,
    default: () => ({}),
  },
});
const emit = defineEmits(['copy']);
const getTimeAgo = computed(() => time => {
  return formatTimeAgo(time, {});
});
const copy = (item: any) => {
  emit('copy', item);
};
</script>
<style scoped>
.bg {
  background-image: repeating-linear-gradient(
    45deg,
    #000000,
    #000000 14px,
    rgb(255, 231, 114) 14px,
    rgba(255, 231, 114) 14px,
    #000000 15px
  );
  background-size: 20px 20px;
}
</style>
