import { createApp } from 'vue';
import 'virtual:uno.css'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import './assets/styles/app.scss';
import App from './app.vue';
const app = createApp(App);
import VueVirtualScroller from 'vue-virtual-scroller'

app.use(VueVirtualScroller)


app.mount('#app');
