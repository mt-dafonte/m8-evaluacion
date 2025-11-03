import { defineStore } from 'pinia';
import { useAntecedenteStore } from './antecedente';
import { auth, db } from '../firebase/init.js';

import {
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    createUserWithEmailAndPassword
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

// 🚨 ESTABLECE AQUÍ TU CORREO DE ADMINISTRADOR REAL
// Reemplaza esta cadena con el email exacto que usaste para registrar la cuenta de admin en Firebase.
const ADMIN_EMAIL = 'admin@portafolio.cl';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        loading: false,
        error: null,
        isAuthReady: false,
    }),

    getters: {
        isAuthenticated: (state) => !!state.user,
        // Lógica FINAL: Retorna true si el email del usuario logueado coincide con el ADMIN_EMAIL.
        isAdmin: (state) => {
            // Utilizamos el método toLowerCase() para evitar errores por mayúsculas/minúsculas.
            return state.user && state.user.email && state.user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
        }
    },

    actions: {
        // Inicializa el listener de Firebase Auth.
        initAuth() {
            if (this.isAuthReady) return;
            this.loading = true;

            onAuthStateChanged(auth, async (user) => {
                if (user) {
                    this.user = {
                        uid: user.uid,
                        email: user.email
                    };
            } else {
                this.user = null;
            }
                this.isAuthReady = true;
        this.loading = false;
        console.log('Auth state changed. User:', this.user);
    });
        },

        // Acción para el inicio de sesión
        async loginUser(email, password) {
    this.loading = true;
    this.error = null;
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
    // 🔑 CORRECCIÓN CLAVE: Sincronizar el user de Pinia inmediatamente
                // (antes de que el onAuthStateChanged se dispare/complete)
                this.user = {
                    uid: userCredential.user.uid,
                    email: userCredential.user.email
                };
            } catch (err) {
                this.error = this.getFriendlyErrorMessage(err.code);
                console.error("Firebase Login Error:", err);
            } finally {
                this.loading = false;
            }
        },

        // Acción para el registro de usuario
        async registerUser({ email, password, firstName, lastName }) {
    try {
        this.loading = true;
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        // Guardar datos adicionales en Firestore
        await setDoc(doc(db, 'users', userCredential.user.uid), {
            firstName,
            lastName,
            email,
            createdAt: new Date()
        });

        // SIMPLIFICACIÓN: Guardar en el store solo email y uid
                this.user = {
                    uid: userCredential.user.uid,
                    email,
                };


        this.error = null;
        return { success: true };
    } catch (e) {
        this.error = e.message;
        return { success: false };
    } finally {
        this.loading = false;
    }
},

        // Acción para el cierre de sesión 
        async logoutUser() {
    this.loading = true;
    try {
        // 1. Obtener la instancia del store de antecedentes
        const antecedenteStore = useAntecedenteStore();

        // 2. Detener el listener de Firestore ANTES de cerrar sesión en Firebase
        // 🚨 ESTA ES LA LÍNEA QUE RESUELVE EL ERROR DE PERMISOS 🚨
        antecedenteStore.detenerListenerAntecedentes();

        // 3. Cerrar la sesión de Firebase (Ahora es seguro hacerlo)
        await signOut(auth);
        this.user = null;
        this.loading = false;

    } catch (error) {
        this.loading = false;
        this.error = error;
        console.error("Error al cerrar sesión:", error);
    }
},

// Helper para traducir códigos de error de Firebase
getFriendlyErrorMessage(errorCode) {
    switch (errorCode) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
            return 'Credenciales inválidas. Por favor, verifica tu correo y contraseña.';
        case 'auth/email-already-in-use':
            return 'El correo electrónico ya está registrado.';
        case 'auth/weak-password':
            return 'La contraseña debe tener al menos 6 caracteres.';
        default:
            return 'Ocurrió un error inesperado. Intente de nuevo.';
    }
}
    }
});
