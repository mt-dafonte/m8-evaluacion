#  M8 – Evaluación Final – Portafolio  
**Desarrollado por María Teresa de la Fuente C.**  

 ## Repositorio: https://github.com/mt-dafonte/m8-evaluacion
 ## Link Web Hosting: https://porfafolio-mteresa.web.app

 
  ### Credenciales de administrador

  ```
  correo: admin@portafolio.cl
  contraseña: 123xmi
  ```

---

## Objetivo del proyecto  
El presente portafolio fue desarrollado como entrega final del módulo 8 **“Desarrollo de Portafolio de un Producto Digital”**, con el propósito de consolidar las competencias adquiridas en el diseño, implementación y despliegue de aplicaciones web modernas.  
El objetivo principal es **reflejar el perfil profesional en el área TI**, integrando buenas prácticas de desarrollo, estructura modular, uso de frameworks y despliegue optimizado en la nube mediante **Firebase Hosting**.

---

## Tecnologías utilizadas  

- **Vue 3 (Composition API)**
- **Vite** para entorno de desarrollo y build optimizado  
- **Vuetify 3** como framework de UI (Material Design)  
- **Pinia** para gestión del estado global  
- **Vue Router 4** para la navegación  
- **Firebase (Auth + Firestore + Hosting)**  
- **JavaScript ES6+**  
- **HTML5 / CSS3 / Responsividad adaptativa**

---

## Aspectos técnicos

### 1. Experiencia de uso  
El portafolio presenta una interfaz limpia, intuitiva y adaptable. La navegación es coherente, con un **header persistente** y rutas claramente definidas, permitiendo una experiencia fluida entre secciones (Inicio, Proyectos, Lenguajes, Login, etc.).

### 2. Completitud del entregable  
El proyecto integra todos los componentes requeridos: autenticación, vistas dinámicas, manejo de datos desde Firestore, administración de proyectos y despliegue en Firebase.

### 3. Utilización de tags HTML  
Se emplea una estructura semántica, utilizando etiquetas `<header>`, `<main>`, `<section>`, `<article>` y `<footer>` según el propósito de cada bloque de contenido.

### 4. Responsividad  
La interfaz se adapta correctamente a distintos tamaños de pantalla mediante las **grillas de Vuetify** (`v-container`, `v-row`, `v-col`) y el uso de clases utilitarias (`d-flex`, `flex-wrap`, etc.).

### 5. Interacciones que incentivan la acción  
Los componentes visuales utilizan botones (`v-btn`), efectos hover, enlaces dinámicos y mensajes visuales que invitan a la exploración y navegación.

### 6. Framework de CSS  
Se implementa **Vuetify**, garantizando consistencia visual, accesibilidad y diseño responsivo.

### 7. Código mantenible mediante componentes  
El código está modularizado en componentes Vue reutilizables (`Header.vue`, `Login.vue`, `Register.vue`, `Card.vue`, etc.), lo que favorece la mantenibilidad y escalabilidad.

### 8. Métodos del ciclo de vida de un componente  
Se utilizan hooks de Vue como `onMounted()` para la carga inicial de datos desde Firestore y `onBeforeUnmount()` cuando es necesario limpiar listeners.

### 9. Comunicación entre componentes  
La comunicación se realiza mediante **props** y **emits**, además del estado global compartido con **Pinia** para autenticación y gestión de datos.

### 10. Buenas prácticas en rutas  
- Rutas URI consistentes y jerárquicas (`/login`, `/admin`, `/register`, `/projects`)  
- Parámetros por URL (cuando aplica)  
- Ruta por defecto definida en el router con redirección a HomeView

### 11. Sintaxis básica y avanzada de JavaScript  
Se emplea **JavaScript moderno (ES6/ES7)** con destructuring, funciones flecha, módulos y `async/await` para las operaciones asíncronas con Firebase.

### 12. Configuración e implementación de Firebase  
El proyecto utiliza Firebase para:  
- **Autenticación (Auth)** con persistencia de sesión.  
- **Base de datos (Firestore)** con reglas de seguridad.  
- **Hosting**, configurado con CI/CD mediante GitHub Actions.

### 13. Estados internos y manejo global  
El manejo de estado interno se realiza con `ref()` y `computed()` dentro de componentes, y **Pinia** se utiliza para el control global de sesión y datos.

### 14. Estructura y estándares web  
El proyecto sigue estándares web actuales: HTML5, CSS3, ECMAScript moderno y convenciones de Vue 3.

### 15. Accesibilidad  
El uso de componentes Vuetify asegura compatibilidad con lectores de pantalla y navegación por teclado. Se cuida el contraste y legibilidad de textos.

### 16. Buenas prácticas en JavaScript  
Uso de funciones puras, separación de responsabilidades y manejo de errores en listeners y operaciones con Firestore.

### 17. Despliegue y optimización  
- Build optimizado con **Vite**  
- Archivos servidos desde `/dist`  
- Despliegue automatizado en Firebase Hosting  
- Integración continua (GitHub Actions) para sincronización con el repositorio principal

---

### 2. Configuración de Firebase

- Abre src/firebase/init.js y reemplaza los placeholders con tu configuración real de Firebase:

```// src/firebase/init.js
const firebaseConfig = {
    apiKey: "TU_API_KEY",
    authDomain: "TU_AUTH_DOMAIN",
    projectId: "TU_PROJECT_ID",
    // ... otros campos
};
```

## Estructura del proyecto
```
M8-Evaluación-Final-Portafolio/
├── public/
│ ├── src/
│ ├── assets/
│ ├── components/
│ │ ├── Header.vue
│ │ ├── AppToast.vue
│ │ ├── Login.vue
│ │ ├── Modal.vue
│ │ ├── Register.vue
│ │ └── Card.vue
│ ├── views/
│ │ ├── HomeView.vue
│ │ ├── AdminView.vue
│ │ ├── EditProjectView.vue
│ │ ├── HomeContentw.vue
│ │ ├── ProjectsView.vue
│ │ └── LanguagesView.vue
│ ├── layouts/
│ │ └── HomeLayout.vue
│ ├── stores/
│ │ └── auth.js
│ │ ├── antecedente.js
│ │ ├── notification.js
│ ├── firebase/
│ │ └── init.js
│ ├── router/
│ │ └── index.js
│ ├── App.vue
│ ├── main.js
│ ├── style.css
├── package.json
├── firebase.json
├── vite.config.js
└── README.md
```

## Instalación y ejecución local  

1. Clonar el repositorio:  
```bash
git clone https://github.com/mt-dafonte/m8-evaluacion

cd m8-evaluaion
```

2. Instalar dependencias:

```bash
npm install
```

3. Ejecutar en entorno de desarrollo:
```bash
npm run dev
```

4. Compilar para producción:
```bash
npm run build
```

5. Desplegar a Firebase:
```bash
firebase deploy
```

## Funcionamiento del sitio:

- El proyecto está desarrollado en Vue 3 con Vite y utiliza Vuetify como framework de componentes. La estructura principal del sitio se organiza mediante el enrutador de Vue (vue-router) y distintos layouts y vistas.

- **HomeLayout.vue:**
Actúa como layout principal. Contiene el encabezado (Header.vue) y la estructura general del sitio, además de renderizar las vistas secundarias a través de <router-view>.

- **ProjectsView.vue y Languages.View.vue:**
Muestra todos los antecedentes (proyectos y lenguajes) almacenados en la base de datos de Firebase Firestore.
Desde esta vista, los usuarios autenticados pueden:

- Crear un nuevo antecedente mediante un formulario que envía los datos a Firestore.

- Editar antecedentes existentes, actualizando sus campos y su imagen.

- Eliminar antecedentes, lo que los borra permanentemente de la base de datos.

- También se visualizan las tarjetas (cards) de los antecedentes (proyectos y lenguajes) con su imagen, descripción, categoría y enlace, según corresponda.

- **Router (router/index.js):**
Administra la navegación entre las vistas principales (HomeView, ProjectsView, LanguagesView, etc.) y gestiona las rutas protegidas en caso de que existan áreas de administración.

- **Gestión de autenticación y permisos:**
El sitio usa un store de Pinia (useAuthStore) para manejar el estado de sesión y verificar si el usuario es administrador.

- Solo los administradores pueden crear, editar o eliminar antecedentes.
