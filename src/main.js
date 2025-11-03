import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import { useAuthStore } from './stores/auth';

// Vuetify
import { vuetify } from './plugins/vuetify'

// 1️⃣ Crear instancias de Pinia y Vue
const pinia = createPinia()
const app = createApp(App)

// 2️⃣ Registrar plugins
app.use(pinia)
app.use(vuetify)

// 3️⃣ Inicializar Firebase Auth
const authStore = useAuthStore()
await authStore.initAuth()

// 4️⃣ Montar la app
app.use(router);
app.mount('#app')