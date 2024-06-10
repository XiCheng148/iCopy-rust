import {createApp} from 'vue';
import 'virtual:uno.css'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import './assets/styles/app.scss';
import App from './app.vue';
import VueVirtualScroller from 'vue-virtual-scroller'
import {createPinia} from "pinia";

const app = createApp(App);
const pinia = createPinia()
app.use(VueVirtualScroller)
app.use(pinia)


app.mount('#app');
