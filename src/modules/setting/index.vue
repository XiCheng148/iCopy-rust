<script setup lang="ts">
import { unregister, isRegistered } from '@tauri-apps/api/globalShortcut';
import { invoke } from '@tauri-apps/api';
import { type } from '@tauri-apps/api/os';
import { ref } from 'vue';

const keyMap = {
  Backquote: '`',
  Backslash: '\\',
  BracketLeft: '[',
  BracketRight: ']',
  Comma: ',',
  Equal: '=',
  Minus: '-',
  Plus: 'PLUS',
  Period: '.',
  Quote: "'",
  Semicolon: ';',
  Slash: '/',
  Backspace: 'Backspace',
  CapsLock: 'Capslock',
  ContextMenu: 'Contextmenu',
  Space: 'Space',
  Tab: 'Tab',
  Convert: 'Convert',
  Delete: 'Delete',
  End: 'End',
  Help: 'Help',
  Home: 'Home',
  PageDown: 'Pagedown',
  PageUp: 'Pageup',
  Escape: 'Esc',
  PrintScreen: 'Printscreen',
  ScrollLock: 'Scrolllock',
  Pause: 'Pause',
  Insert: 'Insert',
  Suspend: 'Suspend',
};

const snack = ref({
  show: false,
  color: 'success',
  text: '',
  btnColor: 'primary',
});

const registerHandler = (name, key) => {
  isRegistered(key).then(res => {
    if (res) {
      snack.value.show = true;
      snack.value.text = 'config.hotkey.is_register';
    } else {
      invoke('register_shortcut_by_frontend', {
        name: name,
        shortcut: key,
      }).then(
        () => {
          snack.value.show = true;
          snack.value.text = 'config.hotkey.success';
        },
        e => {
          snack.value.show = true;
          snack.value.text = e;
        }
      );
    }
  });
};
const keyDown = async (e, setKey) => {
  e.preventDefault();
  if (e.keyCode === 8) {
    setKey('');
  } else {
    let newValue = '';
    if (e.ctrlKey) {
      newValue = 'Ctrl';
    }
    if (e.shiftKey) {
      newValue = `${newValue}${newValue.length > 0 ? '+' : ''}Shift`;
    }
    if (e.metaKey) {
      const osType = await type();
      newValue = `${newValue}${newValue.length > 0 ? '+' : ''}${
        osType === 'Darwin' ? 'Command' : 'Super'
      }`;
    }
    if (e.altKey) {
      newValue = `${newValue}${newValue.length > 0 ? '+' : ''}Alt`;
    }
    let code = e.code;
    if (code.startsWith('Key')) {
      code = code.substring(3);
    } else if (code.startsWith('Digit')) {
      code = code.substring(5);
    } else if (code.startsWith('Numpad')) {
      code = 'Num' + code.substring(6);
    } else if (code.startsWith('Arrow')) {
      code = code.substring(5);
    } else if (code.startsWith('Intl')) {
      code = code.substring(4);
    } else if (/F\d+/.test(code)) {
    } else if (keyMap[code] !== undefined) {
      code = keyMap[code];
    } else {
      code = '';
    }
    setKey(
      `${newValue}${newValue.length > 0 && code.length > 0 ? '+' : ''}${code}`
    );
  }
};
</script>

<template>
  <div>
    <v-input
      type="hotkey"
      variant="bordered"
      value="selectionTranslate"
      label="config.hotkey.set_hotkey"
      className="max-w-[50%]"
      @KeyDown="
        e => {
          keyDown(e, 'setSelectionTranslate');
        }
      "
      @focus="
        () => {
          unregister('selectionTranslate');
        }
      "
    />
    <v-btn
      size="sm"
      @clice="
        () => {
          registerHandler('hotkey_selection_translate', 'selectionTranslate');
        }
      "
    >
      ok
    </v-btn>
    <v-snackbar
      v-model="snack.show"
      :timeout="2000"
      :vertical="true"
      :color="snack.color"
    >
      {{ snack.text }}

      <template v-slot:actions>
        <v-btn
          color="snack.btnColor"
          variant="text"
          @click="snack.show = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>
