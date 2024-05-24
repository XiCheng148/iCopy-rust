import { createApp } from 'vue';
import 'virtual:uno.css'

import './assets/styles/app.scss';
import App from './app.vue';
const app = createApp(App);


import { vuetify } from './plugins/vuetify';
app.use(vuetify);

app.mount('#app');
