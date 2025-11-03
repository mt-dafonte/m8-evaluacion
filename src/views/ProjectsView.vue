<script setup>
import { computed, onMounted } from 'vue';
import Card from '../components/Card.vue';
import { useAntecedenteStore } from '../stores/antecedente';

const antecedenteStore = useAntecedenteStore();

// Filtramos solo los antecedentes de tipo "Proyecto"
const projectCards = computed(() =>
  antecedenteStore.antecedentes.filter(a => a.categoria === false)
);

// Iniciamos el listener al montar
onMounted(() => {
    if (!antecedenteStore.listenerIniciado) {
        antecedenteStore.iniciarListenerAntecedentes();
    }
});
</script>

<template>
  <v-container fluid>
    <v-row class="d-flex flex-wrap" dense>
      <v-col 
        v-for="item in projectCards" 
        :key="item.id" 
        cols="12" sm="6" md="4" lg="3"
        class="d-flex mb-4"
      >
        <Card :project="item" class="antecedente-card" />
      </v-col>
    </v-row>
  </v-container>
</template>