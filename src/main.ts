import { createApp } from 'vue'
import { createPinia } from 'pinia'
import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.css';
import './assets/styles/index.scss';

import App from './App.vue'
import router from './router'

const app = createApp(App)


app.mount('#app')
