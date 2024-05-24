// src/hooks/useDexie.js
import { ref, onMounted, onUnmounted } from 'vue';
import Dexie from 'dexie';

// 创建数据库
const db = new Dexie('MyDatabase');
db.version(1).stores({
  list: '++id, content, time',
});

export function useDexie() {
  const list = ref([]);

  const add = async (content: string) => {
    await db.list.add({ content, time: new Date() });
    await fetchList();
  };

  const fetchList = async () => {
    list.value = await db.list.toArray();
    console.log('list.value: ', list.value);
  };

  onMounted(() => {
    fetchList();
  });

  return {
    list,
    add,
    fetchList,
  };
}
