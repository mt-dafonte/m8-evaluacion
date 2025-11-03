<script setup>
import { ref, watch } from 'vue';

// Definición de las props que recibe el modal
const props = defineProps({
    show: {
        type: Boolean,
        default: false
    },
    // Solo se usa para AGREGAR, pero si lo reusamos, es útil.
    // Para la creación, esta prop será null o no se pasa.
    initialProject: {
        type: Object,
        default: null
    }
});

// Definición de los eventos que emite el modal
const emit = defineEmits(['close', 'save']);

// Estado inicial del antecedente vacío/por defecto
const defaultProject = {
    codigo: '',
    nombre: '',
    año: '',
    estado: '',
    descripcion: '',
    img: 'https://placehold.co/400x200/222/FFF?text=Antecedente+Nuevo', // URL de imagen por defecto
    categoria: null, // Vacío por defecto, el administrador decide el estado al crear el antecedente
    link: '',
};

// Objeto reactivo que modela los datos del formulario
const projectData = ref({ ...defaultProject });

// Título dinámico del modal (Crear o Editar)
const modalTitle = ref('Agregar Nuevo Antecedente');

// Lógica para precargar/resetear el formulario cuando el modal se abre/cierra o el antecedente cambia
watch(() => props.show, (newVal) => {
    if (newVal) {
        // Al abrir: resetear a valores por defecto (modo Crear)
        projectData.value = { ...defaultProject };
        modalTitle.value = 'Agregar Nuevo Antecedente';
    }
});


// Función que se ejecuta al enviar el formulario
const handleSubmit = () => {
    // Validación básica: asegura que no hayan inscritos > cupos al crear
    if (projectData.value.inscritos > projectData.value.cupos) {
        alert("El número de inscritos no puede superar el número de cupos.");
        return;
    }

    // Emitir el evento 'save' con los datos del antecedente.
    // La lógica de Pinia (agregarAntecedente) se ejecuta en AdminView.vue.
    emit('save', projectData.value);
};
</script>

<template>
    <div class="modal fade" :class="{ 'show d-block': show }" tabindex="-1"
        style="background-color: rgba(0, 0, 0, 0.5);" v-if="show">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header bg-primary text-white">
                    <h5 class="modal-title">{{ modalTitle }}</h5>
                    <button type="button" class="btn-close btn-close-white" @click="emit('close')"
                        aria-label="Close"></button>
                </div>
                <form @submit.prevent="handleSubmit">
                    <div class="modal-body">

                        <div class="row g-3">
                            <div class="col-md-4">
                                <label for="tipo" class="form-label">Código</label>
                                <input v-model="projectData.codigo" type="text" class="form-control" id="codigo"
                                    required>
                            </div>
                            <div class="col-md-8">
                                <label for="nombre" class="form-label">Nombre</label>
                                <input v-model="projectData.nombre" type="text" class="form-control" id="nombre"
                                    required>
                            </div>

                            <div class="col-12">
                                <label for="imgUrl" class="form-label">URL imagen de referencia</label>
                                <input v-model="projectData.img" type="text" class="form-control" id="imgUrl"
                                    placeholder="http://..." required>
                                <div class="mt-2" v-if="projectData.img">
                                    <img :src="projectData.img" alt="Vista previa" class="img-thumbnail"
                                        style="max-height: 100px;">
                                </div>
                            </div>

                            <div class="col-md-3">
                                <label for="year" class="form-label">Año</label>
                                <input v-model="projectData.year" type="number" class="form-control" id="year" required>
                            </div>

                            <div class="col-md-3">
                                <label for="estado" class="form-label">Nivel/Estado</label>
                                <input v-model.number="projectData.estado" type="text" class="form-control" id="estado"
                                    required>
                            </div>

                            <div class="col-12">
                                <label for="descripcion" class="form-label">Descripción</label>
                                <textarea v-model="projectData.descripcion" class="form-control" id="descripcion"
                                    rows="3" required></textarea>
                            </div>

                            <div class="col-12">
                                <label for="projectLink" class="form-label">Link del proyecto</label>
                                <input v-model="projectData.link" type="url" class="form-control" id="projectLink"
                                    placeholder="https://...">
                            </div>





                            <div class="col-12">
                                <div class="form-check">
                                    <input v-model="projectData.categoria" class="form-check-input" type="radio"
                                        id="lenguaje" :value="true">
                                    <label class="form-check-label" for="lenguaje">
                                        Lenguaje
                                    </label>
                                </div>

                                <div class="form-check">
                                    <input v-model="projectData.categoria" class="form-check-input" type="radio"
                                        id="proyecto" :value="false">
                                    <label class="form-check-label" for="proyecto">
                                        Proyecto
                                    </label>
                                </div>

                            </div>
                        </div>

                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" @click="emit('close')">Cancelar</button>
                        <button type="submit" class="btn btn-primary">
                            <i class="bi bi-save me-2"></i> Guardar Antecedente
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Estilo para asegurar que el modal se muestre correctamente */
.modal.show {
    display: block;
}
</style>