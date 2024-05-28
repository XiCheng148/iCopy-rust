// src/hooks/useDexie.js
import { ref } from 'vue';
import Dexie from 'dexie';

// 创建数据库
const db = new Dexie('MyDatabase');
db.version(1).stores({
  list: '++id, content, time, type',
});

export function useDexie() {
  const clipboardList = ref([]);

  const add = async (
    content: any,
    type: 'html' | 'img' | 'text' | 'rtf' = 'text'
  ) => {
    await db.list.add({ content, time: new Date(), type });
    await fetchList();
  };

  const fetchList = async () => {
    clipboardList.value = await db.list.orderBy('time').reverse().toArray();
    console.log('fetchList: ', JSON.parse(JSON.stringify(clipboardList.value)));
  };

  // onMounted(() => {
  //   fetchList();
  // });

  return {
    clipboardList,
    add,
    fetchList,
  };
}
