import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import { BootstrapVue3} from 'bootstrap-vue-3';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css';
import FullCalendar from '@fullcalendar/vue3'; // Import FullCalendar component
const app = createApp(App);
app.component('FullCalendar', FullCalendar);
app.use(BootstrapVue3);
app.use(createPinia());
app.use(router);

app.mount('#app');