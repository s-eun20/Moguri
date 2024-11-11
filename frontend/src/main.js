import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import { BootstrapVue3 } from 'bootstrap-vue-3';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css';
import FullCalendar from '@fullcalendar/vue3';

const app = createApp(App);
const pinia = createPinia();

app.component('FullCalendar', FullCalendar);
app.use(BootstrapVue3);
app.use(pinia);
app.use(router);

app.mount('#app');