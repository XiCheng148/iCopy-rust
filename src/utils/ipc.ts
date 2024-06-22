import Database from 'tauri-plugin-sql-api';
import { onMounted, ref } from 'vue';
import {
  AddContetnsReq,
  DeleteContentReq,
  ClipboardList,
  SearchContentReq,
  State,
  Item,
} from '../types';

export const useSql = () => {
  const db = ref<Database>(null!);

  const init = async () => {
    db.value = await Database.load('sqlite:iCopy.sqlite');
    db.value.execute(`
    CREATE TABLE IF NOT EXISTS contents (
      id INTEGER PRIMARY KEY,
      content TEXT NOT NULL,
      type INTEGER NOT NULL,
      state INTEGER NOT NULL,
      time DATETIME DEFAULT CURRENT_TIMESTAMP
      );
  `);
  };

  const addContent = async (params: AddContetnsReq) => {
    try {
      const res = await db.value.execute(
        `INSERT INTO contents (content, type, state) VALUES ($1, $2, $3)`,
        [params.content, params.type, State.ENABLED]
      );
      console.log('addContent', res);
    } catch (error) {
      console.error('新增失败', error);
    }
  };

  const deleteContent = async (params: DeleteContentReq) => {
    try {
      const res = await db.value.execute(
        `UPDATE contents SET state = $1 WHERE id = $2`,
        [State.DISABLED, params.id]
      );
      console.log('deleteContent---', res);
    } catch (error) {
      console.error('Failed to delete content', error);
    }
  };

  const deleteAllContent = async () => {
    try {
      const res = await db.value.execute(`DELETE FROM contents`);
      console.log(res);
    } catch (error) {
      console.error('Failed to delete all content', error);
    }
  };

  const queryContent = async () => {
    try {
      // 查询states=1 的数据
      const result = await db.value.select<ClipboardList>(
        `SELECT * FROM contents WHERE state = 1`
      );
      return result.reverse();
    } catch (error) {
      console.error('查询失败', error);
    }
  };

  const searchContent = async (params: SearchContentReq): Promise<ClipboardList> => {
    let result:ClipboardList = [];
    try {
       result = await db.value.select<ClipboardList>(
        `SELECT * FROM contents WHERE content LIKE $1 AND type = $2`,
        [`%${params.keyWord}%`, params.type]
      );
      console.log('searchContent', result);
      return result.reverse();
    } catch (error) {
      console.error('搜索失败', error);
      result = []
    } finally {
      return result;
    }
  };

  const deleteLastContent = async () => {
    try {
      const res = await db.value.execute(
        `DELETE FROM contents WHERE id = (SELECT MAX(id) FROM contents)`
      );
      console.log(res);
    } catch (error) {
      console.error('最后一个删除失败', error);
    }
  };

  const findLastOne = async (type: Item['type']) => {
    try {
      // 根据类型查询最后一个
      const res = await db.value.select<ClipboardList>(
        `SELECT * FROM contents WHERE type = $1 ORDER BY id DESC LIMIT 1`,
        [type]
      );
      return res[0];
    } catch (error) {
      console.error('最后一个查询失败', error);
    }
  };

  // const handelErr = (fn:Function) => {
  //   const res = fn();
  //   // if(res.lastRowsA)
  // }

  onMounted(async () => {
    await init();
  });

  return {
    addContent,
    deleteContent,
    queryContent,
    searchContent,
    deleteAllContent,
    deleteLastContent,
    findLastOne,
    init,
  };
};
