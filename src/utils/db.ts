// src/hooks/useDexie.js
import { ref, onMounted, onUnmounted } from 'vue';
import Dexie from 'dexie';

// 创建数据库
const db = new Dexie('MyDatabase');
db.version(1).stores({
  list: '++id, content, time, type',
});

export function useDexie() {
  const list = ref([]);

  const add = async (
    content: string | [],
    type: 'html' | 'img' | 'text' | 'rtf' = 'text'
  ) => {
    await db.list.add({ content, time: new Date(), type });
    await fetchList();
  };

  const fetchList = async () => {
    list.value = await db.list.orderBy('time').reverse().toArray();
    console.log('fetchList: ', JSON.parse(JSON.stringify(list.value)));
  };

  // onMounted(() => {
  //   fetchList();
  // });

  return {
    list,
    add,
    fetchList,
  };
}
