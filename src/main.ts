import { createPinia } from 'pinia';
import { createApp } from 'vue';
import 'virtual:uno.css';
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css';
import './assets/styles/app.scss';
import VueVirtualScroller from 'vue-virtual-scroller';
import App from './app.vue';

const app = createApp(App);
const pinia = createPinia();

app.use(VueVirtualScroller).use(pinia).mount('#app');
