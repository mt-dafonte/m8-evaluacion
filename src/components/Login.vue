<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';



// 1. Inicializar Store
const authStore = useAuthStore();
const router = useRouter();

// 2. Desestructurar propiedades reactivas del Store usando storeToRefs
// CLAVE: Debes incluir 'isAdmin' aquí para poder acceder a él reactivamente
const { error, loading, user, isAdmin } = storeToRefs(authStore);

// 3. Variables reactivas para el formulario
const email = ref('');
const password = ref('');

// 4. Función principal de Login
const handleLogin = async () => {
    // 4.1. Limpiar error previo
    authStore.error = null;

    // 4.2. Llamar a la acción del Store
    await authStore.loginUser(email.value, password.value);

    // 4.3. LÓGICA DE REDIRECCIÓN CONDICIONAL
    // Si NO hay error (error es null) y el usuario está establecido (user no es null):
    if (!error.value && user.value) {
        // 🔑 SI el usuario es administrador, redirigir a la vista de administración
        if (isAdmin.value) {
            router.push({ name: 'admin' });
        } else {
            // 🔑 SI es un usuario normal (o no es admin), redirigir a home
            router.push({ name: 'home' });
        }
    }
    // Nota: Gracias a storeToRefs, no necesitamos sincronizar error/loading manualmente.
};
</script>

<template>
    <div class="login-container">
        <v-card class="pa-6" elevation="6">

            <!-- Header -->
            <div class="text-center mb-4">
                <h1 class="fw-bold text-tertiary mb-2">
                    <i class="bi bi-code-square"></i> Portafolio
                </h1>
                <h3 class="fw-bold text-tertiary mb-3">María Teresa de la Fuente C.</h3>
                <p class="text-muted mb-0">Inicia sesión para continuar</p>
            </div>

            <!-- Formulario -->
            <v-form @submit.prevent="handleLogin">

                <!-- Email -->
                <v-text-field v-model="email" label="Correo electrónico" type="email" prepend-icon="mdi-email" outlined
                    required />

                <!-- Contraseña -->
                <v-text-field v-model="password" label="Contraseña" type="password" prepend-icon="mdi-lock" outlined
                    required />

                <!-- Error Alert -->
                <v-alert v-if="error" type="error" dense text class="my-2">
                    {{ error }}
                </v-alert>

                <!-- Botón Login con vuetify-->
                <v-btn type="submit" color="indigo" class="mt-4" block :loading="loading">
                    <template #loader>
                        Iniciando sesión...
                    </template>

                    <!-- Contenido cuando no está cargando -->
                    <v-icon left>mdi-login</v-icon>
                    Iniciar Sesión
                </v-btn>

                <!-- Link a Registro -->
                <div class="text-center mt-3 text-h7">
                    <p class="mb-0 text-muted">
                        ¿No tienes cuenta?
                        <router-link to="/register" class="text-primary fw-semibold text-decoration-none">
                            Regístrate aquí
                        </router-link>
                    </p>
                </div>

            </v-form>
        </v-card>
    </div>
</template>

<style scoped>
/* Los estilos CSS permanecen igual */

.login-container {
    width: 100%;
    max-width: 500px;
    margin: 0 auto;
    box-sizing: border-box;
}

.login-wrapper {
    min-height: 100vh;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
}

/* Contenedor del formulario - Centrado con ancho controlado */
.login-container {
    width: 100%;
    max-width: 500px;
    margin: 0 auto;
    box-sizing: border-box;
}

/* Card del formulario */
.card {
    backdrop-filter: blur(10px);
    background-color: rgba(255, 255, 255, 0.98);
    width: 100%;
}

/* Asegura que el card ocupe todo el ancho del contenedor */
.login-container .v-card {
    width: 100%;
    box-sizing: border-box;
}

/* Tamaños de texto */
.h2 {
    font-size: 2rem;
}

.form-control-lg {
    font-size: 1rem;
    padding: 0.75rem 1rem;
}

.form-label {
    font-size: 0.95rem;
    margin-bottom: 0.5rem;
}

/* RESPONSIVE BREAKPOINTS */

/* Mobile pequeño (< 375px) */
@media (max-width: 374px) {
    .login-container {
        max-width: 100%;
    }

    .card-body {
        padding: 1.5rem !important;
    }

    .h2 {
        font-size: 1.5rem;
    }
}

/* Mobile estándar (375px - 576px) */
@media (min-width: 375px) and (max-width: 576px) {
    .login-container {
        max-width: 90%;
    }

    .card-body {
        padding: 2rem !important;
    }
}

/* Tablet pequeña (577px - 768px) */
@media (min-width: 577px) and (max-width: 768px) {
    .login-container {
        max-width: 480px;
    }

    .card-body {
        padding: 2.5rem !important;
    }
}

/* Tablet grande / Desktop pequeño (769px - 991px) */
@media (min-width: 769px) and (max-width: 991px) {
    .login-container {
        max-width: 500px;
    }

    .card-body {
        padding: 2.5rem !important;
    }
}

/* Desktop estándar (992px - 1199px) */
@media (min-width: 992px) and (max-width: 1199px) {
    .login-container {
        max-width: 520px;
    }

    .card-body {
        padding: 3rem !important;
    }

    .h2 {
        font-size: 2.25rem;
    }
}

/* Desktop grande (1200px - 1399px) */
@media (min-width: 1200px) and (max-width: 1399px) {
    .login-container {
        max-width: 540px;
    }

    .card-body {
        padding: 3rem !important;
    }

    .h2 {
        font-size: 2.5rem;
    }
}

/* Desktop extra grande (>= 1400px) */
@media (min-width: 1400px) {
    .login-container {
        max-width: 560px;
    }

    .card-body {
        padding: 3.5rem !important;
    }

    .h2 {
        font-size: 2.5rem;
    }
}

/* Animaciones suaves */
.card {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2) !important;
}

.btn {
    transition: all 0.3s ease;
}

.btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}
</style>
