import { appWindow } from "@tauri-apps/api/window";

export const hideWindowWithEscape = async (e: any) => {
  if (e.key === 'Escape') {
    await appWindow.hide();
  }
};
