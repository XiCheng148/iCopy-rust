<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Item from '../item/index.vue';

const props = defineProps({
  list: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(['copy', 'del']);

const copy = (item: any) => {
  emit('copy', item);
};

const del = (id: any) => {
  emit('del', id);
};

const scrollContainer = ref();
const index = ref(0);

// 滚动监听
const handleWheel = (event: any) => {
  if (scrollContainer.value) {
    event.preventDefault(); // 阻止默认的垂直滚动行为
    if (event.deltaY > 0) {
      if (index.value <= props.list.length) index.value += 1;
    } else {
      if (index.value !== 0) index.value -= 1;
    }
    try {
      scrollContainer.value.scrollToItem(index.value);
    } catch (error) {
      index.value = props.list.length - 5;
      scrollContainer.value.scrollToItem(index.value);
    }
  }
};

onMounted(async () => {
  if (scrollContainer.value) {
    scrollContainer.value.$el.addEventListener('wheel', handleWheel);
  }
});
</script>

<template>
  <div class="flex">
    <DynamicScroller
      :items="list"
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
          <Item :item="item" class="h-full" @copy="copy" @del="del" />
        </DynamicScrollerItem>
      </template>
    </DynamicScroller>
  </div>
</template>

<style scoped></style>
