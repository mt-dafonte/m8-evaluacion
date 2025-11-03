import { defineStore } from 'pinia';
import { db } from '../firebase/init'; // Importa la instancia de Firestore
import { collection, onSnapshot, query, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';


const ANTECEDENTES_COLLECTION = 'antecedentes';

export const useAntecedenteStore = defineStore('antecedente', {
    state: () => ({
        // Lista principal de antecedentes
        antecedentes: [],
        // Indica si los antecedentes se están cargando
        loading: true,
        // Almacenamos la función de unsubscribe para detener la escucha
        unsub: null,
        // Estado para evitar múltiples listeners
        listenerIniciado: false,
    }),

    getters: {
        // Devuelve la lista de antecedentes disponibles
        antecedentesVisibles: (state) => state.antecedentes,
        loadingProjects: (state) => state.loading,
        getAntecedenteById: (state) => (id) => state.antecedentes.find(a => a.id === id),
    },

    actions: {
        // --- Lógica del Listener ---
        iniciarListenerAntecedentes() {
            // Evitar reiniciar el listener si ya está activo
            if (this.listenerIniciado) return;

            this.loading = true;
            const antecedentesQuery = query(collection(db, ANTECEDENTES_COLLECTION));

            // Guardamos la función de unsubscribe
            this.unsub = onSnapshot(
                antecedentesQuery,
                (snapshot) => {
                    const antecedentesArray = [];
                    snapshot.forEach((doc) => {
                        antecedentesArray.push({
                            id: doc.id,
                            ...doc.data()
                        });
                    });
                    this.antecedentes = antecedentesArray;
                    this.loading = false;
                    this.listenerIniciado = true; // Marcamos como iniciado
                },
                (error) => {
                    console.error("Firestore Listener Error:", error);
                    //  Detenemos listener si hay error de permisos
                    this.detenerListenerAntecedentes();
                }
            );
        },


        //Detiene el listener de Firestore 
        detenerListenerAntecedentes() {
            if (this.unsub) {
                this.unsub(); // Ejecuta la función para detener la escucha
                this.unsub = null; // Limpiamos la referencia
                // Resetear listenerIniciado
                this.listenerIniciado = false;
                console.log("Firestore Listener detenido correctamente.");
            }
        },

        // --- Lógica CRUD ---
        async agregarAntecedente(nuevoAntecedente) {
            try {
                const antecedentesCollection = collection(db, ANTECEDENTES_COLLECTION);

                const antecedenteConMetadatos = {
                    ...nuevoAntecedente,
                    createdAt: new Date().toISOString(),
                };

                const docRef = await addDoc(antecedentesCollection, antecedenteConMetadatos);

                return { success: true, id: docRef.id };

            } catch (err) {
                console.error("Error al agregar antecedente:", err);
                return { success: false, error: err };
            }
        },

        async actualizarAntecedente(id, data) {
            try {
                const antecedenteRef = doc(db, ANTECEDENTES_COLLECTION, id);
                await updateDoc(antecedenteRef, data);
                return { success: true };
            } catch (error) {
                console.error("Error al actualizar antecedente:", error);
                return { success: false, error: error };
            }
        },

        async eliminarAntecedente(id) {
            try {
                const antecedenteRef = doc(db, ANTECEDENTES_COLLECTION, id);
                await deleteDoc(antecedenteRef);
                return { success: true };
            } catch (error) {
                console.error("Error al eliminar antecedente:", error);
                return { success: false, error: error };
            }
        }
    }
});
