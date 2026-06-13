// src/main.js
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import { registerVueDependencies } from './core/Registry.js';
import './style.css'; // Optional: keep if you want global CSS resets here

const app = createApp(App);
const pinia = createPinia();

// Run all centralized registrations
registerVueDependencies(app);

app.use(pinia);
app.mount('#app');