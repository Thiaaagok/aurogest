# Starter Kit — Angular 21

Kit base reutilizable para proyectos Angular con autenticación JWT, sistema de temas claro/oscuro, módulo de usuarios y roles, layout completo con topbar y sidebar colapsable.

---

## Requisitos previos

Antes de copiar los archivos del starter kit al proyecto, asegurate de tener instalado lo siguiente.

### Node.js

Versión mínima requerida: **18.x** (se recomienda 20.x o superior).

```bash
node --version   # debe mostrar v18.x.x o mayor
```

Descargá Node.js desde https://nodejs.org

---

### Angular CLI

```bash
npm install -g @angular/cli
```

Verificar:

```bash
ng version   # debe mostrar Angular CLI 21.x
```

---

## Instalación de dependencias del proyecto

Una vez creado el proyecto Angular (`ng new mi-proyecto --standalone`), reemplazá el `package.json` con el del starter kit y ejecutá:

```bash
npm install
```

Esto instala automáticamente:

| Paquete | Versión | Para qué se usa |
|---|---|---|
| `@angular/core` y resto del framework | ^21.0.0 | Framework base |
| `@angular/material` | ^21.0.0 | Botones FAB, slide-toggle, tooltips, CDK |
| `@angular/cdk` | ^21.0.0 | Drag & drop, overlay (requerido por Material) |
| `primeng` | ^21.0.0 | Tablas, dialogs, selects, datepickers, tags, etc. |
| `@primeng/themes` | ^21.0.0 | Sistema de temas Aura (claro/oscuro) |
| `primeicons` | ^7.0.0 | Íconos usados en botones y columnas |
| `jwt-decode` | ^4.0.0 | Decodificación del token JWT en el frontend |
| `sweetalert2` | ^11.0.0 | Alertas y confirmaciones |
| `rxjs` | ~7.8.0 | Programación reactiva (Observable, BehaviorSubject) |

---

## Font Awesome

Los botones de la botonera flotante (`mat-mini-fab`) usan íconos de Font Awesome (`fa-solid fa-arrows-rotate`, `fa-solid fa-square-plus`, etc.).

Agregar vía CDN en `index.html`:

```html
<link rel="stylesheet"
  href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
```

O instalar el paquete:

```bash
npm install @fortawesome/fontawesome-free
```

Y agregar en `angular.json` dentro de `styles`:

```json
"node_modules/@fortawesome/fontawesome-free/css/all.min.css"
```

---

## Fuente DM Sans (recomendada)

El `styles.scss` del starter kit usa `font-family: 'DM Sans'`. Agregar en `index.html`:

```html
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
```

Si preferís usar otra fuente, modificar la variable en `styles.scss`:

```scss
font-family: 'Tu Fuente', Arial, sans-serif;
```

---

## PrimeIcons en angular.json

Agregar en `angular.json` → `projects → tu-proyecto → architect → build → options → styles`:

```json
"styles": [
  "node_modules/primeicons/primeicons.css",
  "src/styles/styles.scss"
]
```

---

## Configuración del proyecto

### 1. URL del backend

Editar `src/app/common/config/config.ts`:

```typescript
export const Config = {
  APIURL: 'http://localhost:3000',  // cambiar por la URL real del backend
};
```

### 2. Nombre del proyecto en el sidebar

Editar `src/app/layout/sidebar/sidebar.component.ts` → constante `NAV_CONFIG` para agregar las rutas del proyecto.

Editar `src/app/layout/topbar/topbar.component.html` → reemplazar el texto `MI PROYECTO` por el nombre real.

### 3. Color de acento

Editar `src/styles/styles.scss`:

```scss
:root {
  --sk-accent: #2563A8;  /* cambiar por el color del proyecto */
}
```

### 4. Permisos del sistema

Editar `src/app/common/enums/roles.enum.ts` para agregar los permisos propios del proyecto:

```typescript
export type PermisoKey =
  | 'ADMIN'
  | 'VER_USUARIOS'
  // agregar más permisos acá...
```

---

## Módulos opcionales

Estos módulos **no están incluidos** en el starter kit base pero se pueden agregar según el proyecto.

### FullCalendar (para módulo de Turnos / Agenda)

```bash
npm install @fullcalendar/angular @fullcalendar/core \
  @fullcalendar/daygrid @fullcalendar/timegrid @fullcalendar/interaction
```

### pdfmake (solo backend NestJS, para remitos PDF)

```bash
npm install pdfmake
npm install --save-dev @types/pdfmake
```

---

## Estructura de archivos del starter kit

```
src/
├── app/
│   ├── app.config.ts              # providePrimeNG con tema Aura, darkModeSelector: '.app-dark'
│   ├── app.routes.ts              # rutas con lazy loading y AuthGuard
│   │
│   ├── auth/
│   │   ├── components/login/      # login.component.ts / .html / .scss
│   │   ├── guards/                # auth.guard.ts
│   │   ├── interceptors/          # auth.interceptor.ts (refresh automático)
│   │   ├── models/                # login.model.ts + JwtPayload
│   │   └── services/              # auth.service.ts
│   │
│   ├── common/
│   │   ├── config/                # config.ts (APIURL)
│   │   ├── enums/                 # roles.enum.ts (PermisoKey + permisosDisponibles)
│   │   ├── material/              # primeng.module.ts + custom-material.module.ts
│   │   └── services/
│   │       ├── alertas.service.ts       # wrapper SweetAlert2
│   │       ├── grilla-util.service.ts   # cargarGrilla, filtrarGlobal, limpiarFiltrado
│   │       ├── session-timer.service.ts # countdown de sesión con Signal
│   │       └── utilities.service.ts     # BehaviorSubject de título y estado login
│   │
│   ├── layout/
│   │   ├── app-layout.component.ts      # shell con topbar + sidebar + router-outlet
│   │   ├── theme.service.ts             # toggle claro/oscuro, persiste en localStorage
│   │   ├── topbar/                      # topbar.component.ts / .html / .scss
│   │   └── sidebar/                     # sidebar.component.ts / .html / .scss (NAV_CONFIG)
│   │
│   ├── usuarios/
│   │   ├── models/                # usuario.model.ts + RolUsuarioModel
│   │   ├── services/              # usuarios.service.ts
│   │   └── components/
│   │       ├── grilla/            # grilla-usuarios.component.ts / .html
│   │       ├── nuevo/             # nuevo-usuario.component.ts / .html
│   │       └── editar/            # editar-usuario.component.ts / .html
│   │
│   └── roles/
│       ├── services/              # roles.service.ts
│       └── components/
│           ├── roles.component.ts / .html   # formulario inline + grilla en una pantalla
│           └── editar-rol.component.ts      # template inline con p-multiselect de permisos
│
└── styles/
    └── styles.scss                # variables CSS --sk-*, modo oscuro, .card, .botonera-flotante
```

---

## Checklist de arranque

Antes de levantar el proyecto por primera vez, verificar:

- [ ] Node.js 18+ instalado
- [ ] Angular CLI 21 instalado globalmente (`npm install -g @angular/cli`)
- [ ] `npm install` ejecutado en la raíz del proyecto
- [ ] Font Awesome agregado en `index.html` o `angular.json`
- [ ] DM Sans agregado en `index.html`
- [ ] PrimeIcons agregado en `angular.json → styles`
- [ ] `Config.APIURL` apuntando al backend correcto
- [ ] NAV_CONFIG actualizado con las rutas del proyecto
- [ ] Permisos definidos en `roles.enum.ts`
- [ ] Color de acento personalizado en `styles.scss`
- [ ] Backend corriendo con los endpoints `/auth/login`, `/auth/refresh`, `/usuarios`, `/roles-usuario`

---

## Levantar el proyecto

```bash
npm start
# o equivalente:
ng serve --open
```

El proyecto queda disponible en `http://localhost:4200`.
