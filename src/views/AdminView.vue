<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useAuthStore } from '../stores/auth';
import { useAntecedenteStore } from '../stores/antecedente';
import { useRouter } from 'vue-router';
import Modal from '../components/Modal.vue';
import { useNotificationStore } from '../stores/notification';// Componente de modal que crearemos
import { persistentSingleTabManager } from 'firebase/firestore';

// 1. Inicialización de Stores
const authStore = useAuthStore();
const antecedenteStore = useAntecedenteStore();
const router = useRouter();
const notificationStore = useNotificationStore();

// 2. Reactividad
const { user, isAuthenticated } = storeToRefs(authStore);
const { antecedentesVisibles, loadingProjects } = storeToRefs(antecedenteStore);

// 3. Lógica del Header: Nombre de Usuario
const userNameDisplay = computed(() => {
    return user.value && user.value.email ? user.value.email.split('@')[0] : 'Admin';
});

// 4. Lógica de Cierre de Sesión
const handleLogout = async () => {
    await authStore.logoutUser();
    if (!isAuthenticated.value) {
        router.push({ name: "login" });
    }
};

// 5. Lógica del Modal de Administración
const isModalOpen = ref(false);

//Modal de confirmación para agregar antecedente
const isConfirmAddModalOpen = ref(false);
const pendingNewProject = ref(null);

//Modal de confirmación para eliminar antecedente
const isConfirmDeleteModalOpen = ref(false);
const pendingDeleteProject = ref(null);


// Abre el modal para agregar un nuevo antecedente
const openAddModal = () => {
    isModalOpen.value = true;
};

// Cierra el modal
const closeModal = () => {
    isModalOpen.value = false;
};

// 6. Lógica de CRUD
const handleSaveProject = async (antecedente) => {

    //Guardar datos temporalmente y abrir modal de confirmación
    pendingNewProject.value = { ...antecedente };
    isConfirmAddModalOpen.value = true;
};

//Confirmar o cancelar agregar antecedente nuevo
const confirmAddProject = async () => {
    if (!pendingNewProject.value) return;
    const result = await antecedenteStore.agregarAntecedente(pendingNewProject.value);
    if (result.success) {
        notificationStore.showNotification({
            type: 'success',
            message: 'Antecedente agregado con éxito.'
        });
    } else {
        notificationStore.showNotification({
            type: 'error',
            message: 'Error al agregar antecedente.'
        });
    }

    //Cerrar ambos modales
    isConfirmAddModalOpen.value = false;
    closeModal();
    pendingNewProject.value = null;
};

//Cancelar agregar antecedente
const cancelAddProject = () => {
    isConfirmAddModalOpen.value = false;
    pendingNewProject.value = null;
};



//7. carga de antecedentes en tiempo real
onMounted(() => {
    // Si la HomeView no se ha cargado (listener activo), lo iniciamos aquí
    antecedenteStore.iniciarListenerAntecedentes();

    //Convertir estados a booleanos para todos los antecedentes cargados
    antecedentesVisibles.value.forEach(a => {
        a.estado = a.estado === true || a.estado === 'true' ? true : false
    });
});


//Abrir modal de confirmación para eliminar antecedente
const openDeleteModal = (antecedenteId, nombre) => {
    pendingDeleteProject.value = { id: antecedenteId, nombre };
    isConfirmDeleteModalOpen.value = true;
};

//Cancela eliminación de antecedente
const cancelDeleteProject = () => {
    isConfirmDeleteModalOpen.value = false;
    pendingDeleteProject.value = null;
};

//Confirmar eliminación de antecedente
const confirmDeleteProject = async () => {
    if (!pendingDeleteProject.value) return;
    const { id, nombre } = pendingDeleteProject.value;
    const result = await antecedenteStore.eliminarAntecedente(id);
    if (result.success) {
        notificationStore.showNotification({
            type: 'success',
            message: `🗑️ Antecedente '${nombre}' eliminado.`
        });
    } else {
        notificationStore.showNotification({
            type: 'error',
            message: '❌ Error al eliminar antecedente.'
        });
    }
    isConfirmDeleteModalOpen.value = false;
    pendingDeleteProject.value = null;
};


// 9. Lógica de edición (Redirección)
const goToEdit = (antecedenteId) => {
    console.log('Redirigiendo al editor de antecedente con ID:', antecedenteId);
    //Redirige a la ruta de edición usando el ID del antecedente
    router.push({ name: 'editProject', params: { id: antecedenteId } });
};

</script>

<template>
    <Header :user-name="userNameDisplay" @logout="handleLogout" />

    <div class="admin-view-wrapper bg-white">
        <main class="container py-4">
            <h2 class="mb-4 text-primary text-center text-h4">Panel de Administración de Antecedentes</h2>

            <div class="d-flex justify-content-end mb-3">
                <v-btn @click="openAddModal" class="btn fw-semibold" color="indigo-darken-3">
                    <i class="bi bi-plus-circle-fill me-2"></i> Agregar Nuevo Antecedente
                </v-btn>
            </div>

            <div class="table-responsive shadow-sm rounded-3">
                <table class="table table-hover align-middle mb-0 bg-white">
                    <thead class="bg-light">
                        <tr>
                            <th>Código</th>
                            <th>Nombre</th>
                            <th>Año</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="loadingProjects">
                            <td colspan="6" class="text-center py-4">Cargando datos...</td>
                        </tr>
                        <tr v-else v-for="antecedente in antecedentesVisibles" :key="antecedente.id">
                            <td>{{ antecedente.codigo }}</td>
                            <td>{{ antecedente.nombre }}</td>
                            <td>{{ antecedente.year }}</td>
                            <td>
                                <span
                                    :class="['badge', antecedente.categoria ? 'text-bg-primary' : 'text-bg-secondary']">
                                    {{ antecedente.categoria ? 'Lenguaje' : 'Proyecto' }}
                                </span>
                            </td>
                            <td>
                                <button @click="goToEdit(antecedente.id)" class="btn btn-sm btn-info me-2">
                                    <i class="bi bi-pencil-square"></i>
                                </button>
                                <button @click="openDeleteModal(antecedente.id, antecedente.nombre)"
                                    class="btn btn-sm btn-danger">
                                    <i class="bi bi-trash"></i>
                                </button>
                            </td>
                        </tr>
                        <tr v-if="!loadingProjects && antecedentesVisibles.length === 0">
                            <td colspan="6" class="text-center py-4 text-muted">No hay antecedentes registrados.</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </main>
    </div>

    <!-- Modal para agregar/editar antecedente -->
    <Modal :show="isModalOpen" @close="closeModal" @save="handleSaveProject" />

    <!-- Modal de confirmación para agregar antecedente -->
    <div v-if="isConfirmAddModalOpen" class="modal fade show d-block" style="background: rgba(0,0,0,0.5);">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Confirmar agregado</h5>
                    <button type="button" class="btn-close" @click="cancelAddProject"></button>
                </div>
                <div class="modal-body">
                    <p>¿Deseas agregar el antecedente <strong>{{ pendingNewProject?.nombre }}</strong>?</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" @click="cancelAddProject">Cancelar</button>
                    <button type="button" class="btn btn-success" @click="confirmAddProject">Agregar
                        antecedente</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal de confirmación de eliminar antecedente -->
    <div v-if="isConfirmDeleteModalOpen" class="modal fade show d-block" style="background: rgba(0,0,0,0.5);">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Confirmar eliminación</h5>
                    <button type="button" class="btn-close" @click="cancelDeleteProject"></button>
                </div>
                <div class="modal-body">
                    <p>¿Estás seguro de que quieres ELIMINAR el antecedente <strong>{{ pendingDeleteProject?.nombre
                    }}</strong>?</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" @click="cancelDeleteProject">Cancelar</button>
                    <button type="button" class="btn btn-danger" @click="confirmDeleteProject">Sí, borrar</button>
                </div>
            </div>
        </div>
    </div>

</template>

<style scoped>
/* Estilos específicos para la tabla de administración */
.admin-view-wrapper {
    min-height: 100vh;
}

.table-responsive {
    border: 1px solid #dee2e6;
}

.table thead th {
    font-weight: bold;
    color: #495057;
    background-color: #f8f9fa;
}

.modal {
    display: block;
}
</style>