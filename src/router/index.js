import { createRouter, createWebHistory } from 'vue-router';
// Importa el Store de Auth (debes importarlo de esta manera para usarlo fuera de un componente)
import { useAuthStore } from '../stores/auth';

// Layout principal
import HomeLayout from '../views/layouts/HomeLayout.vue';

// Vistas hijas
import HomeContent from '../views/HomeContent.vue';
import ProjectsView from '../views/ProjectsView.vue';
import LanguagesView from '../views/LanguagesView.vue';
import Login from '../components/Login.vue';
import Register from '../components/Register.vue';
import AdminView from '../views/AdminView.vue';
import EditProjectView from '../views/EditProjectView.vue';


// Definición de las rutas
const routes = [
    {
        path: '/',
        component: HomeLayout,
        children: [
            { path: '', name: 'home', component: HomeContent },
            { path: 'login', name: 'login', component: Login },       // ✅ Login dentro del layout
            { path: 'register', name: 'register', component: Register }, // ✅ Register dentro del layout
            { path: 'proyectos', name: 'projects', component: ProjectsView },
            { path: 'lenguajes', name: 'languages', component: LanguagesView },
            { path: 'admin', name: 'admin', component: AdminView, meta: { requiresAuth: true } },
        ],
    },
    {
        path: '/admin/editar/:id',
        name: 'editProject',
        component: EditProjectView,
        meta: { requiresAuth: true }
    },
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});

// 🔑 Guardia global de rutas
router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore();

    // Aseguramos que el store haya inicializado el estado de auth
    if (!authStore.isAuthReady) {
        await new Promise(resolve => {
            const stop = authStore.$subscribe(() => {
                if (authStore.isAuthReady) {
                    stop();
                    resolve();
                }
            });
        });
    }

    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

    // Si la ruta requiere autenticación y no hay usuario
    if (requiresAuth && !authStore.isAuthenticated) {
        return next({ name: 'login' });
    }

    // Permitir navegación
    return next();
});

export default router;