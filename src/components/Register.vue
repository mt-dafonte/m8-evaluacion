<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
// 1. iniciar el Store
const authStore = useAuthStore();

// 2. Variables reactivas para el formulario
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const firstName = ref('');
const lastName = ref('')

// 3. Variables auxiliares para la UI
const success = ref(null);
// Usamos computed para leer directamente del store. El error del store se limpia en la acción.
const localError = ref(null);

// 4. Función principal de Registro
const handleRegister = async () => {
    // Limpiar estados locales
    localError.value = null;
    success.value = null;

    // Validar que las contraseñas coincidan
    if (password.value !== confirmPassword.value) {
        localError.value = 'Las contraseñas no coinciden';
        return;
    }

    // El Store se encarga de manejar el estado `loading`

    // Registrar usuario
    const result = await authStore.registerUser({
        email: email.value,
        password: password.value,
        firstName: firstName.value,
        lastName: lastName.value
    });

    // Si la promesa devuelve éxito (sin Firebase error)
    if (result && result.success) {
        success.value = '¡Cuenta creada exitosamente! Redirigiendo...';

        // Esperar 2 segundos y redirigir
        setTimeout(() => {
            // IMPLEMENTACIÓN CRÍTICA
            router.push({ name: 'login' });
        }, 2000);
    }
};
</script>

<template>
    <div class="register-wrapper">
        <div class="register-container">
            <v-card class="pa-6" elevation="6">
                <div class="text-center mb-4">
                    <p class="h2 fw-bold text-success mb-2 text-h4">
                        <i class="bi bi-person-plus"></i> Crear Cuenta
                    </p>
                    <p class="text-muted mb-0">Regístrate para comenzar</p>
                </div>

                <!-- Formulario -->
                <v-form @submit.prevent="handleRegister">

                    <!-- Nombre -->
                    <v-text-field v-model="firstName" label="Nombre" prepend-icon="mdi-account" outlined required />

                    <!-- Apellido -->
                    <v-text-field v-model="lastName" label="Apellido" prepend-icon="mdi-account" outlined required />

                    <!-- Email -->
                    <v-text-field v-model="email" label="Correo electrónico" type="email" prepend-icon="mdi-email"
                        outlined required />

                    <!-- Contraseña -->
                    <v-text-field v-model="password" label="Contraseña" type="password" prepend-icon="mdi-lock" outlined
                        required :counter="50" hint="La contraseña debe tener al menos 6 caracteres" />

                    <!-- Confirmar Contraseña -->
                    <v-text-field v-model="confirmPassword" label="Confirmar Contraseña" type="password"
                        prepend-icon="mdi-lock-check" outlined required />

                    <!-- Error Alert: Muestra error local o el error del Store (Firebase) -->
                    <v-alert v-if="localError || authStore.error" type="error" dense text> <!-- 🔴 -->
                        {{ localError || authStore.error }}
                    </v-alert>

                    <!-- Success Alert -->
                    <v-alert v-if="success" type="success" dense text> <!-- 🔴 -->
                        {{ success }}
                    </v-alert>

                    <!-- Botón Registro -->
                    <v-btn type="submit" color="success" class="mt-4" block :loading="authStore.loading">
                        Crear Cuenta
                    </v-btn>

                    <!-- Link a Login -->
                    <div class="text-center mt-3">
                        <p class="mb-0 text-muted text-h7">
                            ¿Ya tienes cuenta?
                            <router-link to="/login" class="text-success fw-semibold text-decoration-none">
                                Inicia Sesión
                            </router-link>
                        </p>
                    </div>
                </v-form>
            </v-card>
        </div>
    </div>
</template>

<style scoped>
.register-wrapper {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
}

.register-container {
   width: 100%;
  max-width: 500px;
  margin: 0 auto;
  box-sizing: border-box;
}

/* Asegura que el card ocupe el 100% del contenedor */
.register-container .v-card {
  width: 100%;
  box-sizing: border-box;
}
</style>