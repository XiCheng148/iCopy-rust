import { writeImageBase64, writeText } from 'tauri-plugin-clipboard-api';
import {
  sendNotification,
  isPermissionGranted,
  requestPermission,
} from '@tauri-apps/api/notification';
import { appWindow } from '@tauri-apps/api/window';
import { dialog } from '@tauri-apps/api';
import { onMounted, ref } from 'vue';
import { ItemType } from '../../types';

export const useItem = (deleteContent:Function, deleteLastContent:Function) => {
  const permissionGranted = ref();

  const copy = async (item: any) => {
    try {
      if (item.item_type !== ItemType.IMAGE) {
        await writeText(item.content);
      } else if (item.item_type === ItemType.IMAGE) {
        await writeImageBase64(item.content);
      }
      if (permissionGranted.value) {
        sendNotification({
          icon: 'icons/icon.ico',
          title: `🎉🎉🎉 复制成功!`,
          body: item.item_type === ItemType.IMAGE ? '' : `${item.content}`,
        });
      }
    } catch (error) {
      dialog.message('复制失败', JSON.stringify(error as any));
    } finally {
      await appWindow.hide();
      await deleteLastContent();
    }
  };

  const del = async (id: number) => {
    try {
      await deleteContent({ id });
      if (permissionGranted) {
        sendNotification({
          icon: 'icons/icon.ico',
          title: '❎ 删除成功!',
        });
      }
    } catch (error) {
      dialog.message('删除失败', JSON.stringify(error as any));
    }
  };
  onMounted(async () => {
    permissionGranted.value = await isPermissionGranted();
    if (!permissionGranted.value) {
      const permission = await requestPermission();
      permissionGranted.value = permission === 'granted';
    }
  });
  return { copy, del };
};
