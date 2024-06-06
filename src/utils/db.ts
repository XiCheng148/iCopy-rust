// src/hooks/useDexie.js
import { ref } from 'vue';
import Dexie from 'dexie';
import { dialog } from '@tauri-apps/api';
import { writeFile, readTextFile } from '@tauri-apps/api/fs';

// 创建数据库
const db: any = new Dexie('MyDatabase');
db.version(1).stores({
  list: '++id, content, time, type',
});

export function useDexie() {
  const clipboardList = ref<any>([]);

  const add = async (
    content: any,
    type: 'html' | 'img' | 'text' | 'rtf' = 'text'
  ) => {
    await db.list.add({ content, time: new Date(), type });
    await fetchList();
  };

  const fetchList = async () => {
    const data: any = await db.list.orderBy('time').reverse().toArray();
    clipboardList.value = [...data];
    console.log('fetchList: ', JSON.parse(JSON.stringify(clipboardList.value)));
    return data;
  };

  const deleteById = async (id: number) => {
    await db.list.delete(id);
    await fetchList();
  };

  const exportData = async () => {
    const data = JSON.stringify(await db.list.toArray());
    try {
      const selected = await dialog.save({ defaultPath: 'iCopy.Data.json' });
      if (selected) {
        // 将 JSON 数据写入到选定的文件
        await writeFile({ path: selected, contents: data });
        dialog.message('导出成功', {
          type: 'info',
        });
      }
    } catch (error) {
      dialog.message('保存失败', {
        type: 'warning',
      });
    }
  };

  const importData = async () => {
    // todo 校验
    // todo 提示
    try {
      // 弹出打开文件对话框让用户选择要导入的 JSON 文件
      const selected = (await dialog.open({
        multiple: false,
        filters: [{ name: 'JSON', extensions: ['json'] }],
      })) as string;
      console.log('selected: ', selected);
      if (selected) {
        // 读取选定的文件内容
        const fileContent = await readTextFile(selected);
        // 将文件内容解析为 JSON 数据
        const jsonData = JSON.parse(fileContent);
        // 处理 jsonData，例如将其导入到数据库中
        console.log('Data imported successfully!', jsonData);
        // 这里添加你的数据处理逻辑
        await db.list.bulkPut(jsonData);
      }
    } catch (error) {
      console.error('Failed to import the file:', error);
    } finally {
      await fetchList();
    }
  };

  // onMounted(() => {
  //   fetchList();
  // });

  return {
    clipboardList,
    add,
    fetchList,
    exportData,
    importData,
    deleteById,
  };
}
