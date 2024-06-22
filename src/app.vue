<script setup lang="ts">
import List from './components/list/index.vue';
import Bar from './components/bar/index.vue';
import { useSql } from './utils/ipc';
import { onMounted, ref, watch } from 'vue';
import { ClipboardList, Item } from './types';
import { useClipboard } from './utils/clipboard';
import { useItem } from './components/item/useItem';

const list = ref<ClipboardList>([]);
const keyWord = ref('');

const {
  queryContent,
  init,
  addContent,
  deleteLastContent,
  deleteContent,
  findLastOne,
  searchContent,
} = useSql();

const query = async () => {
  const res = await queryContent();
  console.log('query', res);
  if (res) {
    list.value = res;
  }
};

const { monitorRunning } = useClipboard(addContent, query, findLastOne);

const { copy, del } = useItem(deleteContent, deleteLastContent);

const copyFn = async (item: Item) => {
  copy(item);
};
const delFn = async (id: Item['id']) => {
  del(id);
  await query();
};

const searchHandel = async (keyWord: string, type: Item['type']) => {
  const res = await searchContent({ keyWord, type });
  list.value = res;
};
watch(keyWord, async (val) => {
  console.log('keyWord', val);

  if (val) {
    await searchHandel(val, 0);
  } else {
    await query();
  }
});

onMounted(async () => {
  await init();
  await query();
});
</script>

<template>
  <div
    class="h-100vh flex flex-col rounded-xl bg-[var(--bg)]"
    :class="[
      // 'transition-all duration-[var(--duration)] delay-[var(--dealy)]'
    ]"
  >
    <Bar
      class="flex-shrink-0"
      :monitorRunning="monitorRunning"
      v-model="keyWord"
    />
    <List class="flex-grow" :list="list" @copy="copyFn" @del="delFn" />
  </div>
</template>
