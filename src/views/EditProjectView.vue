<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useAuthStore } from "../stores/auth";
import { useAntecedenteStore } from "../stores/antecedente"; // Asegúrate de que el path es correcto
import { useNotificationStore } from '../stores/notification';
import Header from "../components/Header.vue";

// 1. Inicialización de Stores y Router
const authStore = useAuthStore();
const antecedenteStore = useAntecedenteStore();
const notificationStore = useNotificationStore();
const router = useRouter();
const route = useRoute(); // Para acceder a los parámetros de la ruta

// 2. Reactividad
const { user } = storeToRefs(authStore);
const { antecedentesVisibles, loadingProjects } = storeToRefs(antecedenteStore);

// 3. Estado Local del Formulario
// Inicializamos con null y se llenará con los datos del antecedente a editar
const projectData = ref(null);
const isLoadingData = ref(true);

// 4. Obtener y cargar el antecedente
const projectId = route.params.id;

onMounted(() => {
  // Es crucial que el listener esté activo para que antecdentesVisibles se llene
  antecedenteStore.iniciarListenerAntecedentes();
});

// Usamos un watcher para esperar a que los antecedentes se carguen desde Firestore
watch(
  [antecedentesVisibles, loadingProjects],
  ([newAntecedentes, newLoading]) => {
    // Si ya no está cargando O si el listener ya retornó datos
    if (!newLoading && newAntecedentes.length > 0 && projectData.value === null) {
      const project = newAntecedentes.find(a => a.id === projectId);

      if (project) {
        // Clonamos el objeto para evitar mutar el estado del store directamente
        projectData.value = { ...project };
        isLoadingData.value = false;
      } else {
        // Si el antecedente no existe (por si el usuario ingresa un ID incorrecto)
        notificationStore.showNotification({
          type: 'error',
          message: `❌ Antecedente con ID ${projectId} no encontrado.`
        });
        router.push({ name: 'admin' });
      }
    }
  }, { immediate: true }
);


// 5. Lógica del Header
const userNameDisplay = computed(() => {
  return user.value && user.value.email ? user.value.email.split("@")[0] : "Admin";
});

const handleLogout = async () => {
  await authStore.logoutUser();
  router.push({ name: "login" });
};

//Modal de confirmación agregar antecedente
const isConfirmModalOpen = ref(false);
const pendingUpdate = ref(null);

const openConfirmModal = () => {
  isConfirmModalOpen.value = true;
};

const closeConfirmModal = () => {
  isConfirmModalOpen.value = false;
};

const confirmUpdateProject = async () => {
  closeConfirmModal();
  await updateProjectConfirmed();
};


// 6. Lógica de Edición (CRUD)
const handleUpdateProject = async () => {
  if (!projectData.value || !projectId) return;

 
  //Confirmación antes de actualizar
  pendingUpdate.value = { ...projectData.value };
  openConfirmModal();
};

// 6.1 Separamos el ID del resto de los datos (la ID no se debe enviar para actualizar)
const updateProjectConfirmed = async () => {
  const { id, ...dataToUpdate } = projectData.value;

  // 6.2 Llamamos a la acción de edición en el store
  const result = await antecedenteStore.actualizarAntecedente(projectId, dataToUpdate);

  if (result.success) {
    notificationStore.showNotification({
      type: 'success',
      message: `✅ Antecedente '${projectData.value.nombre}' actualizado con éxito.`
    });
    // Redirigir de vuelta al panel de administración
    router.push({ name: 'admin' });
  } else {
    notificationStore.showNotification({
      type: 'error',
      message: '❌ Error al actualizar el antecedente.'
    });
  }
};

// 7. Navegación
const goBack = () => {
  router.push({ name: 'admin' });
};
</script>

<template>
  <Header :user-name="userNameDisplay" @logout="handleLogout" />

  <div class="edit-view-wrapper bg-light min-vh-100">
    <main class="container py-5">
      <h2 class="mb-4 text-center text-primary">
        <i class="bi bi-pencil-square me-2"></i> Editar Antecedente
      </h2>

      <!-- Estado de Carga -->
      <div v-if="isLoadingData || projectData === null" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Cargando datos...</span>
        </div>
        <p class="mt-2 text-muted">Cargando datos del antecedente con ID: {{ projectId }}...</p>
      </div>

      <!-- Formulario de Edición -->
      <div v-else class="card shadow-lg rounded-3 border-0 mx-auto" style="max-width: 800px;">
        <div class="card-header bg-secondary text-white fw-bold">
          Editando: {{ projectData.nombre }} ({{ projectData.codigo }})
        </div>
        <form @submit.prevent="handleUpdateProject" class="card-body">
          <div class="row g-4">
            <!-- Código y Nombre -->
            <div class="col-md-4">
              <label for="codigo" class="form-label fw-semibold">Código</label>
              <input v-model="projectData.codigo" type="text" class="form-control" id="codigo" required />
            </div>
            <div class="col-md-8">
              <label for="nombre" class="form-label fw-semibold">Nombre</label>
              <input v-model="projectData.nombre" type="text" class="form-control" id="nombre" required />
            </div>

            <!-- URL Imagen -->
            <div class="col-12">
              <label for="imgUrl" class="form-label fw-semibold">URL de Imagen de referencia</label>
              <input v-model="projectData.img" type="text" class="form-control" id="imgUrl" placeholder="http://..."
                required />
              <div class="mt-2 text-center">
                <img :src="projectData.img" alt="Vista previa" class="img-thumbnail rounded-3"
                  style="max-height: 150px; width: auto;">
              </div>
            </div>

    
            <div class="col-md-3">
              <label for="year" class="form-label fw-semibold">Año</label>
              <input v-model="projectData.year" type="number" class="form-control" id="year" required />
            </div>
            <div class="col-md-3">
              <label for="estado" class="form-label fw-semibold">Nivel/Estado</label>
              <input v-model.number="projectData.estado" type="text" class="form-control" id="estado" 
                required />
            </div>
         

            <!-- Descripción -->
            <div class="col-12">
              <label for="descripcion" class="form-label fw-semibold">Descripción</label>
              <textarea v-model="projectData.descripcion" class="form-control" id="descripcion" rows="3"
                required></textarea>
            </div>

            <!-- Categoria (Radio) -->
            <div class="col-12">
              <div class="form-check">
                <input v-model="projectData.categoria" class="form-check-input" type="radio" id="lenguaje"
                  value="true" />
                <label class="form-check-label fw-semibold" for="lenguaje">
                  Lenguajes
                </label>
              </div>
              <div class="form-check">
                <input v-model="projectData.categoria" class="form-check-input" type="radio" id="proyecto"
                  value="false" />
                <label class="form-check-label fw-semibold" for="proyecto">
                  Proyectos
                </label>
              </div>


            </div>
          </div>

          <!-- Botones de Acción -->
          <div class="d-flex justify-content-between mt-4 border-top pt-3">
            <button type="button" class="btn btn-outline-secondary" @click="goBack">
              <i class="bi bi-arrow-left-circle me-2"></i> Volver
            </button>
            <button type="submit" class="btn btn-success fw-semibold">
              <i class="bi bi-save me-2"></i> Guardar Cambios
            </button>
          </div>
        </form>
      </div>

      <!-- MODAL DE CONFIRMACIÓN -->
      <div v-if="isConfirmModalOpen" class="modal fade show d-block" tabindex="-1" style="background: rgba(0,0,0,0.5);">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Confirmar actualización</h5>
              <button type="button" class="btn-close" @click="closeConfirmModal"></button>
            </div>
            <div class="modal-body">
              <p>¿Deseas guardar los cambios del antecedente <strong>{{ pendingUpdate?.nombre }}</strong>?</p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="closeConfirmModal">
                Cancelar
              </button>
              <button type="button" class="btn btn-success" @click="confirmUpdateProject">
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      </div>




    </main>
  </div>


</template>

<style scoped>
.edit-view-wrapper {
  background-color: #f8f9fa !important;
}

.card-header {
  background-color: #6c757d !important;
}

.modal {
  display: block;
}
</style>
