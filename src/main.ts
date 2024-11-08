// src/main.ts

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import './assets/main.css'

const app = createApp(App)

const savedTheme = localStorage.getItem('theme')
if (savedTheme === 'dark') {
    document.documentElement.classList.add('dark-theme')
}

app.use(router)
app.mount('#app')
