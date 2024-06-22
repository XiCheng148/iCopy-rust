import { onMounted, onUnmounted, ref } from 'vue';
import {
  hasFiles,
  hasHTML,
  hasImage,
  hasRTF,
  hasText,
  listenToMonitorStatusUpdate,
  onClipboardUpdate,
  onFilesUpdate,
  onImageUpdate,
  onTextUpdate,
  startListening,
} from 'tauri-plugin-clipboard-api';
import { UnlistenFn } from '@tauri-apps/api/event';
import { useStorage } from '@vueuse/core';
import { ItemType } from '../types';

export function useClipboard(
  addContent: Function,
  queryContent: Function,
  findLastOne: Function
) {
  const monitorRunning = useStorage('monitorRunning', false, localStorage);
  let unlistenTextUpdate: UnlistenFn;
  let unlistenImageUpdate: UnlistenFn;
  let unlistenHtmlUpdate: UnlistenFn;
  // let unlistenRTF: UnlistenFn;
  let unlistenClipboard = ref();
  let unlistenFiles: UnlistenFn;
  const has = ref({
    html: {
      content: '',
      has: false,
    },
    img: {
      content: '',
      has: false,
    },
    text: {
      content: '',
      has: false,
    },
    rtf: {
      content: '',
      has: false,
    },
    flies: {
      content: '',
      has: false,
    },
  });

  listenToMonitorStatusUpdate(running => {
    monitorRunning.value = running;
  }).then(_ => {});

  onMounted(async () => {
    unlistenTextUpdate = await onTextUpdate(async newText => {
      if (!/\S/.test(newText)) return;
      const res = await findLastOne(ItemType.TEXT);
      if(res.content === newText) return;
      await addContent({ content: newText, type: ItemType.TEXT });
      await queryContent();
    });
    // unlistenHtmlUpdate = await onHTMLUpdate(async newHtml => {
    //
    // });
    unlistenImageUpdate = await onImageUpdate(async b64Str => {
      const res = await findLastOne(ItemType.IMAGE);
      if(res.content === b64Str) return;
      await addContent({ content: b64Str, type: ItemType.IMAGE });
      await queryContent();
    });
    unlistenFiles = await onFilesUpdate(async newFiles => {
      const res = await findLastOne(ItemType.TEXT);
      if(res.content === newFiles) return;
      await addContent({
        content: JSON.stringify(newFiles),
        type: ItemType.FILES,
      });
      await queryContent();
    });
    // unlistenRTF = await onRTFUpdate(async newRTF => {
    //   if (has.value.rtf.content === newRTF) return;
    //   if (!hasNew.value) hasNew.value = true;
    //   await add(newRTF);
    //   has.value.rtf.content = newRTF;
    // });
    unlistenClipboard.value = await startListening();

    await onClipboardUpdate(async () => {
      has.value.html.has = await hasHTML();
      has.value.img.has = await hasImage();
      has.value.text.has = await hasText();
      has.value.rtf.has = await hasRTF();
      has.value.flies.has = await hasFiles();
    });
  });

  onUnmounted(() => {
    if (unlistenTextUpdate) unlistenTextUpdate();
    if (unlistenImageUpdate) unlistenImageUpdate();
    if (unlistenHtmlUpdate) unlistenHtmlUpdate();
    if (unlistenFiles) unlistenFiles();
    if (unlistenClipboard.value) unlistenClipboard.value();
  });
  return {
    monitorRunning,
    unlistenClipboard,
  };
}
