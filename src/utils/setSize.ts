import { PhysicalSize, appWindow, primaryMonitor } from "@tauri-apps/api/window";

export const setWindowSize = async () => {
  const monitor = await primaryMonitor();
  if (monitor) {
    const { width } = monitor.size;
    console.log('window size: ', width, Math.floor(width / 7));
    await appWindow.setSize(new PhysicalSize(width, Math.floor(width / 7))); // 设置宽度为 800，高度为屏幕工作区高度
  }
};
