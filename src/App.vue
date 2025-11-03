<script setup>
import { onMounted, watch } from 'vue';
//BORRAR import { useRouter } from 'vue-router';
import { useAuthStore } from './stores/auth';
import { storeToRefs } from 'pinia'; // Necesario para la reactividad
import AppToast from './components/AppToast.vue';

const authStore = useAuthStore();
//BORRAR? const router = useRouter();

// Extraemos la ref reactiva 'isAuthReady'
const { isAuthReady } = storeToRefs(authStore);

onMounted(() => {
  // Inicializa el listener de Firebase Auth
  authStore.initAuth();
});

// Watcher solo para estado de autenticación, no hay header aquí
watch(isAuthReady, (isReady) => {
  if (isReady && authStore.isAuthenticated) {
    console.log('Usuario autenticado y auth listo:', authStore.user);
  }
});
</script>

<template>
  <v-app>
    <!-- Solo renderizamos router-view si auth está listo -->
    <router-view  />

    <!--/*BORRAR
    v-if="isAuthReady"
    <!-- Spinner mientras auth se inicializa 
    <div v-else class="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div class="text-center">
        <div class="spinner-border text-primary" style="width: 4rem; height: 4rem;" role="status">
          <span class="visually-hidden">Cargando...</span>
        </div>
        <p class="text-muted mt-3 fs-5b text-6">Verificando sesión...</p>
      </div>
    </div>
    -->
    

    <AppToast />

  </v-app>
</template>


<style scoped>
/* BORRAR?
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
  */
</style>
