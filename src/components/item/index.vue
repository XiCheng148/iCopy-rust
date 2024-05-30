<template>
  <div
    :class="[
      'bg-slate-800 text-xl w-200px p-2',
      'flex  overflow-hidden lamb-7 text-ellipsis',
      item.type === 'img' ? 'justify-center items-center' : '',
      'ring-1 ring-inset ring-white/10 rounded-lg shadow-xl',
      'transition-all hover:-translate-y-1',
      'select-none',
    ]"
    @dblclick="copy(item)"
  >
    {{ item.type !== 'img' ? item.content : '' }}
    <div
      v-if="item.type === 'img'"
      class="w-full h-full bg-contain bg-no-repeat bg-center"
      :style="{
        'background-image': `url(data:image/jpg;base64,${item.content})`,
      }"
    ></div>
  </div>
</template>
<script setup lang="ts">
defineProps(['item']);
const emit = defineEmits(['copy']);
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
