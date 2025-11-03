<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Card from '../components/Card.vue';
import { useAntecedenteStore } from '../stores/antecedente';

const router = useRouter();
const antecedenteStore = useAntecedenteStore();

// Estado para mostrar la card inicial
const showInitialCard = ref(true);

// Función que maneja la selección de categoría
const handleSelectCategory = (isLanguage) => {
    if (isLanguage) {
        router.push({ name: 'languages' });
    } else {
        router.push({ name: 'projects' });
    }
};

// Inicializar listener de Firestore cuando se monta el componente
onMounted(() => {
  if (!antecedenteStore.listenerIniciado) {
    antecedenteStore.iniciarListenerAntecedentes();
  }
});
</script>

<template>
    <!-- Card inicial -->
    <v-container fluid class="d-flex justify-center align-center" style="min-height: 100vh;">
        <Card v-if="showInitialCard" @selectCategory="handleSelectCategory" />
    </v-container>
</template>