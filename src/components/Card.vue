<script setup>
import { computed } from 'vue';

// Nueva prop para recibir un proyecto/antecedente
const props = defineProps({
    project: {
        type: Object,
        default: null
    }
});

// Computed para saber si es card inicial o de antecedente
const isInitialCard = computed(() => !props.project);

// Computed para normalizar la imagen (local en public o URL externa)
const projectImg = computed(() => {
  if (!props.project || !props.project.img) return '/img/default.jpg';
  // Detecta si es URL externa
  if (props.project.img.startsWith('http')) return props.project.img;
  // Si no empieza con http, asumimos que es ruta local en public
  return props.project.img.startsWith('/') ? props.project.img : `/${props.project.img}`;
});

</script>

<template>
     <div class="card-wrapper" :class="{ 'initial-wrapper': isInitialCard }">
        <v-card :class="['responsive-card', isInitialCard ? 'initial-card' : 'antecedente-card']" mx-auto color="white">

            <template v-if="isInitialCard">
                <v-img class="align-end text-white initial-img" height="50%" src="/img/2781478.jpg" cover>
                    <v-card-title class="bg-secondary">MARÍA TERESA DE LA FUENTE C.</v-card-title>
                </v-img>

                <v-card-subtitle class="pt-4">
                    PORTAFOLIO
                </v-card-subtitle>

                <v-card-text>
                    <div>Desarrollo Front-End</div>
                    <div>Diseño gráfico</div>
                </v-card-text>

                <v-card-actions>
                    <v-btn class="categorias" color="orange" text @click="$emit('selectCategory', true)">
                        Lenguajes
                    </v-btn>
                    <v-btn class="categorias" color="orange" text @click="$emit('selectCategory', false)">
                        Proyectos
                    </v-btn>
                </v-card-actions>
            </template>

            <template v-else>
            <!-- Uso de projectImg computada -->

            
                <v-img class="align-end antecedente-img" height="50%" :src="projectImg" cover></v-img>
                
                <v-card-title>{{ props.project.nombre }}</v-card-title>
                <v-card-subtitle>{{ props.project.year }}</v-card-subtitle>
                <v-card-text class="antecedente-text">
                    <div>{{ props.project.descripcion }}</div>

                    <v-chip :color="props.project.categoria ? 'primary' : 'secondary'" dark small>
                        {{ props.project.categoria ? 'Lenguaje' : 'Proyecto' }}
                    </v-chip>

                    <!-- Botón/link para abrir URL del proyecto si existe -->
                    <div v-if="props.project.link" class="mt-2">
                        <v-btn color="blue darken-2" small text :href="props.project.link" target="_blank">
                            Ver proyecto
                        </v-btn>
                    </div>
                </v-card-text>
            </template>
        </v-card>
    </div>
</template>

<style scoped>
.card-wrapper {
    /* Altura Fija para UNIFICAR el tamaño de TODAS las cards */
    width: 25rem;
    height: 80vh; /* <--- Altura Fija Unificada */

    max-width: 90vw;
    margin: 0 auto;
    display: flex;
    justify-content: center;
}

.initial-wrapper {
    width: 100%;
    max-width: 1200px; /* Ajusta según tu diseño */
    height: auto; 
}

.responsive-card {
    width: 100%;
    /* Quitamos aspect-ratio para usar la altura del wrapper */
    height: 100%;
    /* Ocupa el 100% de la altura fija del card-wrapper */

    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border-radius: 1rem;
    box-shadow: 0 0.25rem 1.25rem rgba(0, 0, 0, 0.15);
    overflow: hidden;
    font-size: 1rem;
}

/* 🔴 Ajuste para que la card inicial ocupe todo el espacio disponible */
.initial-card {
    height: 80vh; /* Ocupa la mayor parte de la pantalla */
    max-height: 90vh; /* No se deforma */
}



/* La Card Inicial usa responsive-card + ajustes específicos si es necesario */

/* Si necesitas ajustes específicos para la card inicial, ve aquí. 
/* Por ahora, responsive-card es suficiente. */


/* ⚠️ ATENCIÓN: Se elimina la altura fija en antecedente-card y se usa la altura del wrapper */
.antecedente-card {
    width: 100%;
    height: 100%;
    /* Ocupa el 100% de la altura fija del card-wrapper */
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
}

/* Imagen de la Card Inicial (ajustada a 50% de altura) */
.initial-img {
    height: 50% !important;
    /* <--- Imagen alta unificada */
}

/* Imagen de antecedente: Crecida a 50% de la altura de la card, fondo blanco */
.antecedente-img {
    width: 100%;
    height: 50%;
    /* <--- Imagen alta unificada */
    object-fit: cover;
    object-position: center;
    background-color: white;
    /* <--- Fondo blanco para la imagen */
}

/* Textos de antecedente con scroll si exceden */
.antecedente-text {
    flex-grow: 1;
    overflow-y: auto;
    padding: 1rem;
}

.v-chip {
    margin-top: .5rem;
}

.categorias {
    margin-bottom: 1rem;
}

/* Responsividad móviles */
@media (max-width: 600px) {
    .card-wrapper {
        width: 90%; /* 90% ancho en móviles */
        height: auto; /* altura automática según contenido */
    }

    .initial-card {
        height: auto; /* para móviles la altura se adapta */
    }

    /* Las cards internas mantienen height: 100% de su wrapper */

    .initial-img,
    .antecedente-img {
        height: 45% !important;
        /* Altura de imagen ajustada para móvil */
    }


}
</style>