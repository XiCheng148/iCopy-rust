<script setup lang="ts">
import { ref } from 'vue';
import { clipboard } from '@tauri-apps/api';
let lastClipboardContent = '';
const list = ref([]);
const collect = ref([]);
const tab = ref();
const collectValue = ref();
const tip = ref('');
const showTip = ref(false);
const tabs = ref(['历史', '收藏']);
setInterval(async () => {
  const currentClipboardContent = await clipboard.readText();

  if (currentClipboardContent !== lastClipboardContent) {
    lastClipboardContent = currentClipboardContent;
    console.log('currentClipboardContent: ', currentClipboardContent);
    console.log('剪贴板内容发生变化！');
    list.value.push(currentClipboardContent);
  }
}, 0);

const submit = () => {
  console.log('collectValue.value: ', collectValue.value);
  if (!collectValue.value) {
    tip.value = '请输入内容';
    showTip.value = true;
    return;
  };
  collect.value.push(collectValue.value);
  collectValue.value = '';
};
</script>

<template>
  <v-card>
    <v-tabs v-model="tab" bg-color="primary">
      <v-tab :value="item" v-for="item in tabs">{{ item }}</v-tab>
    </v-tabs>

    <v-card-text>
      <v-window v-model="tab">
        <v-window-item
          :value="tabs[0]"
          class="flex flex-col-reverse gap-16px"
        >
          <v-card :title="`${item}`" v-for="item in list" />
        </v-window-item>

        <v-window-item
          :value="tabs[1]"
          class="flex flex-col-reverse gap-16px"
        >
          <v-card :title="`${item}`" v-for="item in collect" />
          <v-form @submit.prevent>
            <v-text-field v-model="collectValue" label="添加收藏" />
            <v-btn class="mt-2" type="submit" @click="submit"> Submit </v-btn>
          </v-form>
        </v-window-item>
      </v-window>
    </v-card-text>
  </v-card>
  <v-snackbar v-model="showTip">
    {{ tip }}
  </v-snackbar>
</template>
