import { ref, onMounted, onUnmounted, computed } from 'vue';
import {
  onClipboardUpdate,
  onImageUpdate,
  onTextUpdate,
  onHTMLUpdate,
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
export function useClipboard() {
  let monitorRunning = ref(false);
  let unlistenTextUpdate: UnlistenFn;
  let unlistenImageUpdate: UnlistenFn;
  let unlistenHtmlUpdate: UnlistenFn;
  let unlistenRTF: UnlistenFn;
  let unlistenClipboard: () => Promise<void>;
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

  const hasNew = computed(() => {
    const res =  Object.keys(has.value).filter(key => has.value[key]);
    return res
  });
  onMounted(async () => {
    unlistenTextUpdate = await onTextUpdate(newText => {
      has.value.text.content = newText;
    });
    unlistenHtmlUpdate = await onHTMLUpdate(newHtml => {
      has.value.html.content = newHtml;
    });
    unlistenImageUpdate = await onImageUpdate(b64Str => {
      has.value.img.content = b64Str;
    });
    unlistenFiles = await onFilesUpdate(newFiles => {
      has.value.flies.content = newFiles;
    });
    unlistenRTF = await onRTFUpdate(newRTF => {
      has.value.rtf.content = newRTF;
    });
    unlistenClipboard = await startListening();

    onClipboardUpdate(async () => {
      has.value.html.has = await hasHTML();
      has.value.img.has = await hasImage();
      has.value.text.has = await hasText();
      has.value.rtf.has = await hasRTF();
      has.value.flies.has = await hasFiles();
    });
  });

  listenToMonitorStatusUpdate(running => {
    monitorRunning.value = running;
  });

  onUnmounted(() => {
    if (unlistenTextUpdate) unlistenTextUpdate();
    if (unlistenImageUpdate) unlistenImageUpdate();
    if (unlistenHtmlUpdate) unlistenHtmlUpdate();
    if (unlistenFiles) unlistenFiles();
    if (unlistenClipboard) unlistenClipboard();
  });
  return {
    monitorRunning,
    hasNew
  };
}
