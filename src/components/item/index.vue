<template>
  <div
    :class="[
      item.type === ItemType.IMAGE ? 'justify-center items-center' : '',
      'w-197px text-4 leading-6',
      'flex flex-col justify-between',
      'ring-1 ring-inset ring-[var(--border)] rounded-lg',
      ' select-none hover:-translate-y-2',
      'item-bg overflow-hidden relative',
      'transition-all',
    ]"
  >
    <div
      class="absolute top-2px right-2px cursor-pointer w-3 h-3 rounded-full bg-white/50 dark:bg-white/10 hover:bg-red"
      @click="delHandler(item.id)"
    ></div>
    <div
      class="flex-grow"
      :class="item.type !== ItemType.IMAGE ? 'm-2' : 'hidden'"
      @dblclick="copyHandler(item)"
    >
      {{ item.content }}
    </div>
    <div
      v-if="item.type === ItemType.IMAGE"
      class="w-full h-full bg-contain bg-no-repeat bg-center"
      :style="{
        'background-image': `url(data:image/jpg;base64,${item.content})`,
      }"
      @dblclick="copyHandler(item)"
    ></div>
    <div
      class="absolute w-full h-auto bottom-0 left-0 bg-[var(--border)] flex justify-between"
    >
      <div class="ml-10px">{{ ItemTypeCn[item.type] }}</div>
      <div class="mr-10px">{{ getTimeAgo(item.time) }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, PropType } from 'vue';
import { formatTimeAgo } from '@vueuse/core';
import { Item, ItemType, ItemTypeCn } from '../../types';
defineProps({
  item: {
    type: Object as PropType<Item>,
    default: () => ({}),
  },
});
const emit = defineEmits(['copy', 'del']);

const getTimeAgo = computed(() => (time: string) => {
  return formatTimeAgo(new Date(time), {});
});

const copyHandler = async (item: any) => {
  emit('copy', item);
};
const delHandler = (id: any) => {
  emit('del', id);
};
</script>
<style scoped>
.animated {
  animation-duration: 0.3s;
  animation-fill-mode: both;
}

@keyframes wobble {
  from {
    transform: translate3d(0, 0, 0);
  }

  15% {
    transform: translate3d(-5%, 0, 0) rotate3d(0, 0, 1, -5deg);
  }

  30% {
    transform: translate3d(5%, 0, 0) rotate3d(0, 0, 1, 3deg);
  }

  45% {
    transform: translate3d(-1%, 0, 0) rotate3d(0, 0, 1, -3deg);
  }

  60% {
    transform: translate3d(1%, 0, 0) rotate3d(0, 0, 1, 2deg);
  }

  75% {
    transform: translate3d(-1%, 0, 0) rotate3d(0, 0, 1, -1deg);
  }

  to {
    transform: translate3d(0, 0, 0);
  }
}

.wobble:hover {
  animation-name: wobble;
}

.item-bg {
  background-image: repeating-linear-gradient(
    45deg,
    var(--bg),
    var(--bg) 26px,
    var(--line) 26px,
    var(--line) 27px
  );
  background-size: 38px;
}

.item-bg:hover {
  background-position: 50%;
}
</style>
