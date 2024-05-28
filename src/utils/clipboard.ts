import { ref, onMounted, onUnmounted } from 'vue';
import {
  onClipboardUpdate,
  onImageUpdate,
  onTextUpdate,
  // onHTMLUpdate,
  onRTFUpdate,
  onFilesUpdate,
  startListening,
  listenToMonitorStatusUpdate,
  hasHTML,
  hasImage,
  hasText,
  hasRTF,
  hasFiles,
} from 'tauri-plugin-clipboard-api';
import { UnlistenFn } from '@tauri-apps/api/event';
import { useDexie } from './db';

export function useClipboard() {
  const { add } = useDexie();

  let monitorRunning = ref(false);
  let unlistenTextUpdate: UnlistenFn;
  let unlistenImageUpdate: UnlistenFn;
  let unlistenHtmlUpdate: UnlistenFn;
  let unlistenRTF: UnlistenFn;
  let unlistenClipboard = ref(null);
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
      content: [],
      has: false,
    },
  });

  const hasNew = ref(false);

  listenToMonitorStatusUpdate(running => {
    monitorRunning.value = running;
  });

  onMounted(async () => {
    unlistenTextUpdate = await onTextUpdate(async newText => {
      if (has.value.text.content === newText) return;
      if (!/\S/.test(newText)) return;
      if (hasNew.value) return;
      hasNew.value = true;
      await add(newText);
      has.value.text.content = newText;
    });
    // unlistenHtmlUpdate = await onHTMLUpdate(async newHtml => {
    //   if (!hasNew.value) hasNew.value = true;
    //   await add(newHtml);
    // });
    unlistenImageUpdate = await onImageUpdate(async b64Str => {
      if (has.value.img.content === b64Str) return;
      if (!hasNew.value) hasNew.value = true;
      await add(b64Str, 'img');
      has.value.img.content = b64Str;
    });
    unlistenFiles = await onFilesUpdate(async newFiles => {
      if (has.value.flies.content === newFiles) return;
      if (!hasNew.value) hasNew.value = true;
      await add(JSON.stringify(newFiles));
      has.value.flies.content = newFiles;
    });
    unlistenRTF = await onRTFUpdate(async newRTF => {
      if (has.value.rtf.content === newRTF) return;
      if (!hasNew.value) hasNew.value = true;
      await add(newRTF);
      has.value.rtf.content = newRTF;
    });
    unlistenClipboard.value = await startListening();

    onClipboardUpdate(async () => {
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
    hasNew,
    unlistenClipboard,
  };
}
