<script setup>
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useAuthStore } from '../stores/auth';

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

// Obtener refs reactivas del store
const { user, isAuthenticated, isAdmin } = storeToRefs(authStore);

//Solución 1: Computed para asegurar reactividad del nombre de la ruta
const currentRouteName = computed(() => route.name);


const displayName = computed(() => {
    if (!user.value) return 'Invitado';
    return user.value.email || 'Usuario'; // Usar email
});

const menuOpen = ref(false);

// Funciones de navegación siempre usando nombres de ruta

const goToLogin = () => {
    console.log('--- ¡CLIC EN LOGIN DETECTADO! ---'); // 👈 DEBEMOS ver esto
    router.push('/login');
};

const goToHome = () => router.push('/');
const goToAdmin = () => router.push({ name: 'admin' });

// Funciones de navegación para las nuevas rutas
const goToLanguages = () => router.push({ name: 'languages' });
const goToProjects = () => router.push({ name: 'projects' });


const logout = async () => {
    // 1. Llama a la acción del store (debería poner isAuthenticated a false)
    await authStore.logoutUser();
    router.push('/');
};
</script>

<template>
    <v-app-bar color="primary" dark flat height="64">
        <div class="d-flex align-center justify-space-between w-100 px-4">

            <!-- Título -->
            <v-toolbar-title class="font-weight-bold text-truncate text-uppercase" style="cursor:pointer;"
                @click="goToHome">
                <i class="bi bi-code-square mr-2"></i> Portafolio
            </v-toolbar-title>

            <!-- Desktop -->
            <div class="d-none d-sm-flex align-center">

                <v-btn color="white" class="me-3 text-white fw-semibold" @click="goToLanguages" variant="text">
                    Lenguajes
                </v-btn>
                <v-btn color="white" class="me-3 text-white fw-semibold" @click="goToProjects" variant="text">
                    Proyectos
                </v-btn>

                <template v-if="isAuthenticated">

                    <v-btn v-if="isAdmin && currentRouteName === 'admin'" color="info" class="me-2 text-white"
                        @click="goToHome" variant="text">
                        <v-icon start>mdi-eye</v-icon> Volver a Home
                    </v-btn>

                    <v-btn v-if="isAdmin && currentRouteName !== 'admin'" color="warning" class="me-3 text-white"
                        @click="goToAdmin" variant="text">
                        <v-icon start>mdi-cog</v-icon> Panel Admin
                    </v-btn>

                    <span class="me-3 text-white">
                        Bienvenido, <strong>{{ displayName }}</strong>
                    </span>


                    <v-btn color="white" class="text-white fw-semibold" @click="logout" variant="text">
                        <v-icon start>mdi-logout</v-icon> Cerrar Sesión
                    </v-btn>
                </template>

                <!-- Botón login Desktop -->
                <v-btn type="button" v-else color="secondary" class="fw-semibold text-white" @click="goToLogin"
                    variant="text">
                    <v-icon start>mdi-login</v-icon> Iniciar Sesión
                </v-btn>
            </div>

            <!-- Mobile -->
            <div class="d-flex d-sm-none">
                <v-menu v-model="menuOpen" location="bottom-end" transition="scale-transition">
                    <template #activator="{ props }">
                        <v-btn v-bind="props" icon variant="text" aria-label="Abrir menú" class="menu-btn">
                            <v-icon size="24">mdi-menu</v-icon>
                        </v-btn>
                    </template>

                    <v-list>
                        <v-list-item @click="goToLanguages">
                            <v-icon start>mdi-wrench</v-icon>
                            <v-list-item-title>Lenguajes</v-list-item-title>
                        </v-list-item>
                        <v-list-item @click="goToProjects">
                            <v-icon start>mdi-folder-multiple</v-icon>
                            <v-list-item-title>Proyectos</v-list-item-title>
                        </v-list-item>



                        <v-list-item v-if="isAdmin && currentRouteName === 'admin'" @click="goToHome">
                            <v-icon start>mdi-eye</v-icon>
                            <v-list-item-title>Volver a Home</v-list-item-title>
                        </v-list-item>

                        <v-list-item v-if="isAdmin && currentRouteName !== 'admin'" @click="goToAdmin">
                            <v-icon start>mdi-cog</v-icon>
                            <v-list-item-title>Panel Admin</v-list-item-title>
                        </v-list-item>

                        <v-list-item v-if="isAuthenticated">
                            <v-list-item-title class="fw-semibold">
                                Bienvenido, {{ displayName }}
                            </v-list-item-title>
                        </v-list-item>

                        <v-list-item v-if="isAuthenticated" @click="logout">
                            <v-icon start>mdi-logout</v-icon>
                            <v-list-item-title>Cerrar Sesión</v-list-item-title>
                        </v-list-item>

                        <!-- Botón login Mobile -->
                        <v-list-item v-else @click="goToLogin">
                            <v-icon start>mdi-login</v-icon>
                            <v-list-item-title>Iniciar Sesión</v-list-item-title>
                        </v-list-item>
                    </v-list>
                </v-menu>
            </div>
        </div>
    </v-app-bar>
</template>

<style scoped>
.v-toolbar-title {
    white-space: nowrap;
    font-size: 1.2rem;
    cursor: pointer;
}

/* Móviles */
@media (max-width: 600px) {
    .v-toolbar-title {
        font-size: 1rem;
        max-width: none;
    }
}

.menu-btn {
    background-color: rgba(255, 255, 255, 0.12);
    border-radius: 50%;
    transition: background-color 0.2s, transform 0.2s;
}

.menu-btn .v-icon {
    color: white !important;
    transition: color 0.2s;
}

.menu-btn:hover {
    background-color: rgba(255, 255, 255, 0.25);
    transform: scale(1.05);
}

.menu-btn:hover .v-icon {
    color: #f5f5f5 !important;
}
</style>