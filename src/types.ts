export type AddContetnsReq = {
  content: string;
  type: number;
};

// 类型声明
export enum ItemType {
  'TEXT' = 0,
  'IMAGE' = 1,
  'FILES' = 3,
  'HTML' = 4,
  'RTF' = 5,
}

export const ItemTypeCn = {
  [ItemType.TEXT]: '文本',
  [ItemType.IMAGE]: '图片',
  [ItemType.FILES]: '文件',
  [ItemType.HTML]: 'HTML',
  [ItemType.RTF]: 'RTF',
};

export interface Item {
  id: number;
  content: string;
  type: ItemType;
  status: number;
  time: string;
}

export type ClipboardList = Item[];

export enum State {
  'DISABLED' = 0,
  'ENABLED' = 1,
}

export type DeleteContentReq = {
  id: number;
};

export type SearchContentReq = {
  keyWord: string;
  type: number;
};
