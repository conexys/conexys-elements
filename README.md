# Conexys Elements

Librería de componentes React (TypeScript) que centraliza la interfaz de usuario del ecosistema **Conexys**: formularios, cabeceras, diálogos, tema claro/oscuro, estado del backend, sistema de permisos, servicios HTTP, WebSocket y utilidades de autenticación.

> **TypeScript nativo.** Tipos incluidos: tu IDE te dará autocompletado completo sin configuración extra.

---

## Índice

- [Instalación](#instalación)
- [Dependencias (peerDependencies)](#dependencias-peerdependencies)
- [Inicialización](#inicialización)
- [Proveedores y configuración](#proveedores-y-configuración)
- [Sistema de autenticación (`authStorage`)](#sistema-de-autenticación-authstorage)
- [Componentes](#componentes)
- [Formularios](#formularios)
- [Hooks](#hooks)
- [Servicios HTTP](#servicios-http)
- [Sistema de permisos](#sistema-de-permisos)
- [Utilidades](#utilidades)
- [Internacionalización (i18n)](#internacionalización-i18n)
- [Desarrollo](#desarrollo)
- [Licencia](#licencia)

---

## Instalación

```bash
npm install conexys-elements
# o con yarn
yarn add conexys-elements
# o con pnpm
pnpm add conexys-elements
```

## Dependencias (peerDependencies)

Estas dependencias deben instalarse en tu proyecto consumidor (no vienen empaquetadas):

```
@fingerprintjs/fingerprintjs  ^5.2.0
@mui/icons-material           ^9.1.1
@mui/material                 ^9.1.2
axios                         ^1.18.1
date-fns                      ^4.4.0
jodit-react                   ^5.3.21
prop-types                    ^15.8.1
react                         ^19.2.7
react-dom                     ^19.2.7
react-helmet-async            ^3.0.0
react-hook-form               ^7.80.0
react-i18next                 ^17.0.8
react-router-dom              ^7.18.0
react-select                  ^5.10.2
react-transition-group        ^4.4.5
socket.io-client              ^4.8.3
sweetalert2                   ^11.26.25
sweetalert2-react-content     ^5.1.2
```

Instálalas de una vez:

```bash
npm install react react-dom @mui/material @mui/icons-material axios react-i18next react-helmet-async react-router-dom sweetalert2 sweetalert2-react-content date-fns jodit-react react-select react-hook-form react-transition-group @fingerprintjs/fingerprintjs socket.io-client prop-types
```

> ⚙️ **Dependencias internas** (se resuelven automáticamente): `dompurify`, `material-react-table`, `react-bootstrap`, `react-icons`.

---

## Inicialización

En el componente raíz de tu aplicación, inicializa los servicios y componentes compartidos **una sola vez**:

```tsx
import {
  initializeSharedServices,
  initializeSharedComponents,
} from 'conexys-elements';
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    initializeSharedServices();   // configura los servicios HTTP (base URL, auth)
    initializeSharedComponents(); // configura servicios compartidos de UI
  }, []);

  return <></>;
}
```

---

## Proveedores y configuración

### `ConexysConfigProvider` (obligatorio)

Proporciona la configuración global (modo desarrollo, flags de logging). **Envuelve toda tu app** con él:

```tsx
import { ConexysConfigProvider } from 'conexys-elements';

function App() {
  return (
    <ConexysConfigProvider
      config={{
        enableLogs: import.meta.env.VITE_SHOW_CONSOLE === 'true',
        enableLogsError: import.meta.env.VITE_SHOW_CONSOLE_ERROR === 'true',
        enableLogsWarning: import.meta.env.VITE_SHOW_CONSOLE_WARNING === 'true',
        enableLogsInfo: import.meta.env.VITE_SHOW_CONSOLE_INFO === 'true',
        enableLogsData: import.meta.env.VITE_SHOW_CONSOLE_DATA === 'true',
        developmentMode: import.meta.env.VITE_DEVELOPMENT_MODE === 'true',
      }}
    >
      {/* resto de la app */}
    </ConexysConfigProvider>
  );
}
```

Helpers expuestos: `useConexysConfig()`, `isDevelopmentMode`.

### `ThemeContextProvider`

Tema claro/oscuro basado en MUI. Detecta la preferencia del sistema (`prefers-color-scheme`) y persiste la elección en `localStorage.displaymode`:

```tsx
import { ThemeContextProvider } from 'conexys-elements';

function App() {
  return (
    <ThemeContextProvider>
      {/* tu UI */}
    </ThemeContextProvider>
  );
}
```

### `BackendStatusProvider`

Detecta si el backend está disponible. Renderiza los hijos inmediatamente (arranque optimista) y comprueba la conexión periódicamente; si cae, muestra una página "offline" y recarga al recuperarse:

```tsx
import { BackendStatusProvider } from 'conexys-elements';

<BackendStatusProvider
  checkInterval={30000}          // ms entre comprobaciones (default 30000)
  healthEndpoint="health"        // endpoint de salud (default 'health')
  // fallbackComponent={<MiOffline/>}
>
  {children}
</BackendStatusProvider>
```

Se expone además `useBackendStatus()` → `{ isConnected, isChecking, lastCheck, checkConnection }` y el componente `BackendOfflinePage`.

---

## Sistema de autenticación (`authStorage`)

> 🔐 **Modo cookie (actual).** El JWT se almacena **solo en cookies `HttpOnly`** (`cxauthxc`), inaccesibles desde JavaScript. El token nunca se escribe en `localStorage`, evitando su lectura vía XSS.

API principal:

| Método | Descripción |
|---|---|
| `initialize(configLogs)` | Inicializa la config de sesión (deduplicada, sin cascada de `getsettings`). |
| `getAuthToken()` | Devuelve el marcador `'cookie'` (truthy, nunca el JWT real; la cookie es HttpOnly). |
| `hasActiveSession()` | Comprueba sesión activa real (cookies `cx_session` + `csrf_token`). **Úsalo en las gates que deciden si mostrar el dashboard.** |
| `getCsrfToken()` | Token CSRF (`csrf_token`) para el esquema *double-submit*. |
| `getSessionId()` / `setSessionId()` | Session ID vía cookie legible `cx_session`. |
| `getSessionTypeValue()` | Devuelve `'cookie'`. |
| `removeAuthData()` | Limpia cookies y `localStorage` al hacer logout. |
| `refreshTypeSession()` | Relee el medio de sesión desde la BD (solo en boundaries de auth, ej. login). |

Flujo típico en login:

```tsx
import { authStorage } from 'conexys-elements';

await authStorage.initialize(configLogs);   // resuelve el medio de sesión
await authStorage.setSessionId(sessionId, configLogs);
// el backend emite cxauthxc (HttpOnly) + csrf_token; JS solo ve el marcador
```

---

## Componentes

Importa los componentes desde el paquete:

```tsx
import { Card, Loading, AppHeaderPage, NotFound } from 'conexys-elements';
```

### Cabeceras y páginas

| Componente | Descripción |
|---|---|
| `AppHeaderPage` | Cabecera de página con título, breadcrumb, botón de favoritos y toggle del menú. |
| `AppHeaderPage404` | Cabecera simplificada para 404 (sin favoritos). |
| `AppSetHeaderTitle` | Establece el `<title>` dinámicamente (Helmet + nombre del sitio desde backend). |
| `AppError` | Página de error con ilustración SVG e instrucciones traducidas. |
| `NotFound` | Página 404 traducida con enlace a home. |
| `ErrorBoundary` | Captura errores de renderizado y muestra modal (Close/Reload). Filtra errores "conocidos". |
| `Uservalidationerror` | Limpia datos de usuario y redirige a `/login`. |

### Contenido y datos

| Componente | Descripción |
|---|---|
| `AppDataSettings` | Pide config al backend (`getsettings`) y renderiza el contenido devuelto. |
| `AppDataSettingsHTML` | Igual, pero renderiza HTML sanitizado (`sanitizeHtml`). |
| `AppFormFields` | Formulario completo de usuario autenticado desde config de campos. |
| `AppFormFieldsTable` | Variante de formulario orientada a tablas (CRUD). |
| `AppFormFieldsNoUser` | Formulario sin usuario (registro/recuperación). |
| `AppFormFieldsFromConfig` | Formulario 100 % desde configuración externa (multi-formulario). |

### Diálogos y login

| Componente | Descripción |
|---|---|
| `AppDialogModal` | Modal MUI estilizado con tipos (`Normal`, `Delete`, `DeleteMax`, `Restore`). |
| `LanguageSet` | Selector de idioma para login/registro. |

### Tema

| Componente | Descripción |
|---|---|
| `Card` | Tarjeta base de contenido. |
| `CardDashboard` | Tarjeta de dashboard (cabecera/estadísticas). |
| `CardUser` | Tarjeta de perfil de usuario. |
| `Loading` | Estado de carga con spinner; maneja `loading`/`error`. |
| `Mailbox` | Widget de buzón/correo. |
| `MailTemplateWidget` | Widget de plantillas de correo. |
| `MessagesBlock` | Bloque de mensajes/chat. |
| `Timeline` | Línea de tiempo de eventos. |
| `UserWidget` | Widget de usuario (avatar/estado). |

### Tablas CRUD

| Export | Descripción |
|---|---|
| `Table` | Tabla CRUD basada en Material React Table con acciones. |
| `ActionButtons` | Botones de acción de fila (editar/borrar/restaurar). |
| `useTableData` | Hook de obtención de datos para tablas. |
| `useTableDataInstall` | Hook de datos de tabla para el instalador. |

Ejemplo con `Card` + `Loading` + `ActionButtons`:

```tsx
import { Card, Loading, ActionButtons } from 'conexys-elements';

function MyComponent() {
  return (
    <Card title="Mi tarjeta">
      <Loading type="appnotifications" loading={false} error={undefined}>
        Contenido
      </Loading>
      <ActionButtons
        onSubmit={() => console.log('Guardado')}
        onCancel={() => console.log('Cancelado')}
        submitText="Guardar"
        cancelText="Cancelar"
      />
    </Card>
  );
}
```

---

## Formularios

El motor central es `RenderForm`, que recibe una lista de `FormInputs` y renderiza los controles apropiados. Los componentes atómicos disponibles:

`Button` · `Checkbox` · `Heading` · `Image` · `Info` · `InputFile` · `InputPassword` · `InputText` · `InputWYSIWYG` · `Radiobutton` · `Select` · `Switch` · `Text`

Renderizado + validación:

```tsx
import { RenderForm } from 'conexys-elements';

<RenderForm
  config={formInputs}            // FormInputs[]
  onSubmit={handleSubmit}
  // callbacks de cambio/validación gestionados internamente
/>
```

Los hooks de formulario asociados son `useCustomForm*` (ver [Hooks](#hooks)).

---

## Hooks

| Hook | Descripción |
|---|---|
| `useCustomFormNormal` | Formulario autenticado (POST). |
| `useCustomFormGetPost` | GET previo (cargar) + POST (guardar). |
| `useCustomFormMulti` | Formularios múltiples/configurables. |
| `useCustomFormNoUser` | Formularios sin usuario (registro/recuperación). |
| `useCustomFormUpload` | Subida de archivos (multipart). |
| `useCustomFormUploadPatch` | Variante PATCH de subida. |
| `useFingerprintJS` | Fingerprint del navegador (identificación de dispositivo). |
| `useLanguageSync` | Sincroniza idioma con el almacenamiento/contexto. |
| `usePermission` | Comprobación granular de permisos contra el backend. |
| `useSocket` | Conexión WebSocket (socket.io) con reconexión automática. |
| `useZoomPrevention` | Previene zoom (gestos/teclas) en contextos específicos. |
| `MRT_Localization` | Localización en español para Material React Table. |

### `useSocket`

```tsx
import { useSocket } from 'conexys-elements';

const { socketRef, socketState } = useSocket();
// socketState: { connected: boolean, socketId: string | null }
```

Se conecta automáticamente si hay token; en modo cookie autentica vía `withCredentials` (cookies same-origin) y se reconecta de forma indefinida.

---

## Servicios HTTP

Servicios genéricos y extendidos para consumir la API REST de Conexys.

### Genéricos

| Servicio | Descripción |
|---|---|
| `postservice` / `postService` | POST genérico. |
| `getservice` / `getService` | GET genérico. |
| `patchservice` / `patchService` | PATCH genérico. |
| `deleteservice` / `deleteService` | DELETE genérico. |
| `postFormService` | POST de formulario. |
| `patchFormService` | PATCH de formulario. |
| `deleteFormService` | DELETE de formulario. |
| `restoreFormService` | Restauración de elementos. |

### Extendidos (dominio)

- `postServiceExtended` → `servicePostBasic`, `serviceData`, `servicePost`, `servicePost2`, `servicePostData`, `serviceLockscreen`, `serviceLogout`, `serviceFavorites`, `serviceGetFavorites`.
- `getServiceExtended` → `getServiceBasic`, `getservice2`, `getServiceData`.
- `patchServiceExtended` → `servicePatch2`.
- `deleteServiceExtended` → `serviceDelete2`.

Ejemplo con un servicio extendido:

```tsx
import { serviceData } from 'conexys-elements';

await serviceData(
  url,
  { keys: 'site_name' },
  { headers: { 'Content-Type': 'application/json' } },
  (value) => setData(value),
  configLogs,
);
```

---

## Sistema de permisos

Control de acceso granular por módulo.

- **Contexto:** `PermissionProvider`, `usePermissionContext`.
- **Hook:** `usePermission(options)` → `{ hasPermission, loading }`.
- **Componente:** `PermissionGate` — renderiza `children` si hay permiso, `fallback` si no, `loadingComponent` mientras carga.

```tsx
import { PermissionGate } from 'conexys-elements';

<PermissionGate
  permissionrequired="users.edit"
  permissiontype="module"
  fallback={<span>Sin acceso</span>}
>
  <BotonEditar />
</PermissionGate>
```

---

## Utilidades

| Utilidad | Descripción |
|---|---|
| `authStorage` | Gestión de credenciales/tokens (ver sección dedicada). |
| `checkAuth` | Verificación de autenticación. |
| `sanitizeHtml` | Sanitización de HTML (DOMPurify). |
| `GenerateRandomPassword` | Generador de contraseñas aleatorias. |
| `logConsole` | Log centralizado condicionado por config. |
| `getOrSetFingerprint` | Obtiene o genera el fingerprint del dispositivo. |
| `Url` | URL base del backend (constante). |

### `GenerateRandomPassword`

```tsx
import { GenerateRandomPassword } from 'conexys-elements';

const pass = GenerateRandomPassword({
  numbers: true,
  symbols: true,
  capitalletters: true,
  lowercase: true,
  numberOfCharacters: 16,
});
```

---

## Internacionalización (i18n)

El paquete incluye traducciones para el namespace `global` en **9 idiomas**: `ca`, `de`, `en`, `es`, `eu`, `fr`, `gl`, `it`, `pt`.

Estructura de `global.json`: `general`, `error`, `languages`.

Configura `i18next` apuntando a `node_modules/conexys-elements/dist/language/`:

```tsx
i18n.use(initReactI18next).init({
  resources: {
    es: { global: () => import('conexys-elements/dist/language/es/global.json') },
  },
  // ...
});
```

---

## Desarrollo

```bash
npm install          # instala dependencias
npm run build        # compila (rollup → CJS + ESM en dist/)
npm run type-check   # verifica tipos sin compilar
npm run type-check:watch
npm run lint         # eslint
npm run format:check # prettier --check
npm run format:write # prettier --write
```

El build genera en `dist/`: `index.js` (CommonJS), `index.esm.js` (ESM), sourcemaps y la carpeta `language/`.

### Publicación

```bash
npm pack       # genera el .tgz para probar localmente
npm version patch  # (o minor/major) antes de publicar una actualización
npm publish
```

---

## Licencia

MIT © Braulio Rodriguez
