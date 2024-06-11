import { invoke } from '@tauri-apps/api/tauri';

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

interface SelectRequest {
  id?: number;
}

export async function insert(request: InsertRequest): Promise<string> {
  return await invoke('insert', { request });
}

export async function update(request: UpdateRequest): Promise<string> {
  return await invoke('update', { request });
}

export async function deleteById(request: DeleteRequest): Promise<string> {
  return await invoke('delete', { request });
}

export async function query(request: SelectRequest = {}): Promise<string> {
  return await invoke('query', { request });
}
