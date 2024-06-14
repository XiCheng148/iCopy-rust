import { defineStore } from 'pinia';
import { invoke } from '@tauri-apps/api/tauri';
import { ref } from 'vue';
import { dialog } from '@tauri-apps/api';

interface ClipboardItem {
  id: number;
  content: string;
  item_type: number;
  time: string;
}

interface InsertRequest {
  content: string;
  item_type: number;
}

interface UpdateRequest {
  id: number;
  content: string;
}

interface DeleteRequest {
  id: number;
}

interface QueryRequest {
  id?: number;
}
interface SearchRequest {
  keyword: string;
}

export const useClipboardStore = defineStore('clipboard', () => {
  const list = ref<ClipboardItem[]>([]);
  const loading = ref<boolean>(false);
  const insert = async (request: InsertRequest) => {
    await performAction('insert', request);
  };
  const update = async (request: UpdateRequest) => {
    await performAction('update', request);
  };
  const deleteById = async (request: DeleteRequest) => {
    await performAction('delete', request);
  };
  const search = async (request: SearchRequest) => {
    loading.value = true;
    console.log(
      '%c%o',
      'background: yellow; color: #000;font-size:20px',
      request
    );

    try {
      const response = await invoke<ClipboardItem[]>('search', { request });
      console.log('response: ', response);
      list.value = response;
    } catch (error) {
      console.error(`Failed to search:`, error);
    } finally {
      loading.value = false;
    }
  };
  const query = async (request: QueryRequest = {}) => {
    console.log('------query------');
    loading.value = true;

    try {
      const response = await invoke<ClipboardItem[]>('query', { request });
      list.value = response;
    } catch (error) {
      dialog.message('Failed to query:', error as any);
    } finally {
      loading.value = false;
    }
  };
  const performAction = async (
    action: string,
    request: SearchRequest | InsertRequest | UpdateRequest | DeleteRequest
  ) => {
    loading.value = true;
    console.log(
      '%c%s',
      'background: yellow; color: #000;font-size:20px',
      `${action}: `,
      request
    );

    try {
      await invoke<string>(action, { request });
      await query(); // Re-query the database to ensure consistency
    } catch (error) {
      console.error(`Failed to ${action}:`, error);
    } finally {
      loading.value = false;
    }
  };
  return {
    list,
    loading,
    insert,
    update,
    deleteById,
    query,
    search,
  };
});
