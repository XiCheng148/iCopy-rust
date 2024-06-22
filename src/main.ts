import { createApp } from 'vue';
import 'virtual:uno.css';
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css';
import './assets/styles/app.scss';
import VueVirtualScroller from 'vue-virtual-scroller';
import App from './app.vue';
import { setWindowSize } from './utils/setSize';
import { hideWindowWithEscape } from './utils/keyup';

const app = createApp(App);

setWindowSize();

window.addEventListener('keyup', e => {
  hideWindowWithEscape(e);
});


if ((import.meta as any).env.VITE_NETWORK_PROCESSOR !== 'dev') {
  window.document.addEventListener('contextmenu', e => {
    e.preventDefault();
  });
}

app.use(VueVirtualScroller);
app.mount('#app');
