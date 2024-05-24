import { createApp } from 'vue';
import 'virtual:uno.css'

import './assets/styles/app.scss';
import App from './app.vue';
import { vuetify } from './plugins/vuetify';
const app = createApp(App);


app.use(vuetify);

app.mount('#app');
