<script setup>
import { computed, onMounted } from 'vue';
import Card from '../components/Card.vue';
import { useAntecedenteStore } from '../stores/antecedente';

const antecedenteStore = useAntecedenteStore();

// Filtramos solo los antecedentes de tipo "Lenguaje"
const languageCards = computed(() =>
    antecedenteStore.antecedentes.filter(a => a.categoria === true)
);

// Inicializamos listener solo si aún no se ha iniciado
onMounted(() => {
    if (!antecedenteStore.listenerIniciado) {
        antecedenteStore.iniciarListenerAntecedentes();
    }
});
</script>

<template>
    <v-container fluid class="d-flex flex-column align-center justify-start" style="min-height: 100vh;">
        <v-row class="d-flex flex-wrap" :gutter="24">
            <v-col v-for="item in languageCards" :key="item.id" cols="12" sm="6" md="4" lg="3" class="d-flex mb-4">
                <Card :project="item" class="antecedente-card" />
            </v-col>
        </v-row>
    </v-container>
</template>

<style scoped></style>