# Conexys Elements

A React (TypeScript) component library that centralizes the user interface of the **Conexys** ecosystem: forms, headers, dialogs, light/dark theme, backend status, permission system, HTTP services, WebSocket, and authentication utilities.

> **Native TypeScript.** Types included: your IDE will give you full autocomplete with no extra configuration.

---

## Table of Contents

- [Installation](#installation)
- [Dependencies (peerDependencies)](#dependencies-peerdependencies)
- [Initialization](#initialization)
- [Providers and configuration](#providers-and-configuration)
- [Authentication system (`authStorage`)](#authentication-system-authstorage)
- [Components](#components)
- [Forms](#forms)
- [Hooks](#hooks)
- [HTTP services](#http-services)
- [Permission system](#permission-system)
- [Utilities](#utilities)
- [Internationalization (i18n)](#internationalization-i18n)
- [Development](#development)
- [License](#license)

---

## Installation

```bash
npm install conexys-elements
# or with yarn
yarn add conexys-elements
# or with pnpm
pnpm add conexys-elements
```

## Dependencies (peerDependencies)

These dependencies must be installed in your consumer project (they are not bundled):

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

Install them all at once:

```bash
npm install react react-dom @mui/material @mui/icons-material axios react-i18next react-helmet-async react-router-dom sweetalert2 sweetalert2-react-content date-fns jodit-react react-select react-hook-form react-transition-group @fingerprintjs/fingerprintjs socket.io-client prop-types
```

> ⚙️ **Internal dependencies** (resolved automatically): `dompurify`, `material-react-table`, `react-bootstrap`, `react-icons`.

---

## Initialization

In your application's root component, initialize the shared services and components **only once**:

```tsx
import {
  initializeSharedServices,
  initializeSharedComponents,
} from 'conexys-elements';
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    initializeSharedServices();   // configures HTTP services (base URL, auth)
    initializeSharedComponents(); // configures shared UI services
  }, []);

  return <></>;
}
```

---

## Providers and configuration

### `ConexysConfigProvider` (required)

Provides global configuration (development mode, logging flags). **Wrap your whole app** with it:

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
      {/* rest of the app */}
    </ConexysConfigProvider>
  );
}
```

Exposed helpers: `useConexysConfig()`, `isDevelopmentMode`.

### `ThemeContextProvider`

Light/dark theme based on MUI. Detects the system preference (`prefers-color-scheme`) and persists the choice in `localStorage.displaymode`:

```tsx
import { ThemeContextProvider } from 'conexys-elements';

function App() {
  return (
    <ThemeContextProvider>
      {/* your UI */}
    </ThemeContextProvider>
  );
}
```

### `BackendStatusProvider`

Detects whether the backend is available. Renders the children immediately (optimistic startup) and checks the connection periodically; if it goes down, it shows an "offline" page and reloads once it recovers:

```tsx
import { BackendStatusProvider } from 'conexys-elements';

<BackendStatusProvider
  checkInterval={30000}          // ms between checks (default 30000)
  healthEndpoint="health"        // health endpoint (default 'health')
  // fallbackComponent={<MyOffline/>}
>
  {children}
</BackendStatusProvider>
```

It also exposes `useBackendStatus()` → `{ isConnected, isChecking, lastCheck, checkConnection }` and the `BackendOfflinePage` component.

---

## Authentication system (`authStorage`)

> 🔐 **Cookie mode (current).** The JWT is stored **only in `HttpOnly` cookies** (`cxauthxc`), inaccessible from JavaScript. The token is never written to `localStorage`, preventing its theft via XSS.

Main API:

| Method | Description |
|---|---|
| `initialize(configLogs)` | Initializes the session config (deduplicated, without a cascade of `getsettings`). |
| `getAuthToken()` | Returns the `'cookie'` marker (truthy, never the real JWT; the cookie is HttpOnly). |
| `hasActiveSession()` | Checks for a real active session (`cx_session` + `csrf_token` cookies). **Use it in the gates that decide whether to show the dashboard.** |
| `getCsrfToken()` | CSRF token (`csrf_token`) for the *double-submit* scheme. |
| `getSessionId()` / `setSessionId()` | Session ID via the readable `cx_session` cookie. |
| `getSessionTypeValue()` | Returns `'cookie'`. |
| `removeAuthData()` | Clears cookies and `localStorage` on logout. |
| `refreshTypeSession()` | Re-reads the session medium from the DB (only on auth boundaries, e.g. login). |

Typical login flow:

```tsx
import { authStorage } from 'conexys-elements';

await authStorage.initialize(configLogs);   // resolves the session medium
await authStorage.setSessionId(sessionId, configLogs);
// the backend sets cxauthxc (HttpOnly) + csrf_token; JS only sees the marker
```

---

## Components

Import the components from the package:

```tsx
import { Card, Loading, AppHeaderPage, NotFound } from 'conexys-elements';
```

### Headers and pages

| Component | Description |
|---|---|
| `AppHeaderPage` | Page header with title, breadcrumb, favorites button and menu toggle. |
| `AppHeaderPage404` | Simplified header for the 404 page (no favorites). |
| `AppSetHeaderTitle` | Sets the `<title>` dynamically (Helmet + site name from the backend). |
| `AppError` | Error page with SVG illustration and translated instructions. |
| `NotFound` | Translated 404 page with a link back home. |
| `ErrorBoundary` | Catches render errors and shows a modal (Close/Reload). Filters "known" errors. |
| `Uservalidationerror` | Clears user data and redirects to `/login`. |

### Content and data

| Component | Description |
|---|---|
| `AppDataSettings` | Requests config from the backend (`getsettings`) and renders the returned content. |
| `AppDataSettingsHTML` | Same, but renders sanitized HTML (`sanitizeHtml`). |
| `AppFormFields` | Complete authenticated-user form from field config. |
| `AppFormFieldsTable` | Table-oriented form variant (CRUD). |
| `AppFormFieldsNoUser` | Form without a user (registration/recovery). |
| `AppFormFieldsFromConfig` | 100% config-driven form (multi-form). |

### Dialogs and login

| Component | Description |
|---|---|
| `AppDialogModal` | Styled MUI modal with types (`Normal`, `Delete`, `DeleteMax`, `Restore`). |
| `LanguageSet` | Language selector for login/registration. |

### Theme

| Component | Description |
|---|---|
| `Card` | Base content card. |
| `CardDashboard` | Dashboard card (header/statistics). |
| `CardUser` | User profile card. |
| `Loading` | Loading state with spinner; handles `loading`/`error`. |
| `Mailbox` | Inbox/mail widget. |
| `MailTemplateWidget` | Mail templates widget. |
| `MessagesBlock` | Messages/chat block. |
| `Timeline` | Event timeline. |
| `UserWidget` | User widget (avatar/status). |

### CRUD tables

| Export | Description |
|---|---|
| `Table` | CRUD table based on Material React Table with actions. |
| `ActionButtons` | Row action buttons (edit/delete/restore). |
| `useTableData` | Data-fetching hook for tables. |
| `useTableDataInstall` | Table data hook for the installer. |

Example with `Card` + `Loading` + `ActionButtons`:

```tsx
import { Card, Loading, ActionButtons } from 'conexys-elements';

function MyComponent() {
  return (
    <Card title="My card">
      <Loading type="appnotifications" loading={false} error={undefined}>
        Content
      </Loading>
      <ActionButtons
        onSubmit={() => console.log('Saved')}
        onCancel={() => console.log('Cancelled')}
        submitText="Save"
        cancelText="Cancel"
      />
    </Card>
  );
}
```

---

## Forms

The core engine is `RenderForm`, which receives a list of `FormInputs` and renders the appropriate controls. The atomic components available:

`Button` · `Checkbox` · `Heading` · `Image` · `Info` · `InputFile` · `InputPassword` · `InputText` · `InputWYSIWYG` · `Radiobutton` · `Select` · `Switch` · `Text`

Rendering + validation:

```tsx
import { RenderForm } from 'conexys-elements';

<RenderForm
  config={formInputs}            // FormInputs[]
  onSubmit={handleSubmit}
  // change/validation callbacks handled internally
/>
```

The associated form hooks are `useCustomForm*` (see [Hooks](#hooks)).

---

## Hooks

| Hook | Description |
|---|---|
| `useCustomFormNormal` | Authenticated form (POST). |
| `useCustomFormGetPost` | Prior GET (load) + POST (save). |
| `useCustomFormMulti` | Multiple/configurable forms. |
| `useCustomFormNoUser` | Forms without a user (registration/recovery). |
| `useCustomFormUpload` | File upload (multipart). |
| `useCustomFormUploadPatch` | PATCH upload variant. |
| `useFingerprintJS` | Browser fingerprint (device identification). |
| `useLanguageSync` | Synchronizes language with storage/context. |
| `usePermission` | Granular permission checking against the backend. |
| `useSocket` | WebSocket connection (socket.io) with automatic reconnection. |
| `useZoomPrevention` | Prevents zoom (gestures/keys) in specific contexts. |
| `MRT_Localization` | Spanish localization for Material React Table. |

### `useSocket`

```tsx
import { useSocket } from 'conexys-elements';

const { socketRef, socketState } = useSocket();
// socketState: { connected: boolean, socketId: string | null }
```

It connects automatically if there is a token; in cookie mode it authenticates via `withCredentials` (same-origin cookies) and reconnects indefinitely.

---

## HTTP services

Generic and extended services for consuming the Conexys REST API.

### Generic

| Service | Description |
|---|---|
| `postservice` / `postService` | Generic POST. |
| `getservice` / `getService` | Generic GET. |
| `patchservice` / `patchService` | Generic PATCH. |
| `deleteservice` / `deleteService` | Generic DELETE. |
| `postFormService` | Form POST. |
| `patchFormService` | Form PATCH. |
| `deleteFormService` | Form DELETE. |
| `restoreFormService` | Item restore. |

### Extended (domain)

- `postServiceExtended` → `servicePostBasic`, `serviceData`, `servicePost`, `servicePost2`, `servicePostData`, `serviceLockscreen`, `serviceLogout`, `serviceFavorites`, `serviceGetFavorites`.
- `getServiceExtended` → `getServiceBasic`, `getservice2`, `getServiceData`.
- `patchServiceExtended` → `servicePatch2`.
- `deleteServiceExtended` → `serviceDelete2`.

Example with an extended service:

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

## Permission system

Granular per-module access control.

- **Context:** `PermissionProvider`, `usePermissionContext`.
- **Hook:** `usePermission(options)` → `{ hasPermission, loading }`.
- **Component:** `PermissionGate` — renders `children` if permission is granted, `fallback` if not, and `loadingComponent` while loading.

```tsx
import { PermissionGate } from 'conexys-elements';

<PermissionGate
  permissionrequired="users.edit"
  permissiontype="module"
  fallback={<span>No access</span>}
>
  <EditButton />
</PermissionGate>
```

---

## Utilities

| Utility | Description |
|---|---|
| `authStorage` | Credentials/token management (see the dedicated section). |
| `checkAuth` | Authentication check. |
| `sanitizeHtml` | HTML sanitization (DOMPurify). |
| `GenerateRandomPassword` | Random password generator. |
| `logConsole` | Centralized config-conditional logging. |
| `getOrSetFingerprint` | Gets or generates the device fingerprint. |
| `Url` | Backend base URL (constant). |

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

## Internationalization (i18n)

The package includes translations for the `global` namespace in **9 languages**: `ca`, `de`, `en`, `es`, `eu`, `fr`, `gl`, `it`, `pt`.

`global.json` structure: `general`, `error`, `languages`.

Configure `i18next` pointing to `node_modules/conexys-elements/dist/language/`:

```tsx
i18n.use(initReactI18next).init({
  resources: {
    es: { global: () => import('conexys-elements/dist/language/es/global.json') },
  },
  // ...
});
```

---

## Development

```bash
npm install          # installs dependencies
npm run build        # builds (rollup → CJS + ESM in dist/)
npm run type-check   # type-checks without building
npm run type-check:watch
npm run lint         # eslint
npm run format:check # prettier --check
npm run format:write # prettier --write
```

The build generates in `dist/`: `index.js` (CommonJS), `index.esm.js` (ESM), sourcemaps and the `language/` folder.

### Publishing

```bash
npm pack       # generates the .tgz to test locally
npm version patch  # (or minor/major) before publishing an update
npm publish
```

---

## License

MIT © Braulio Rodriguez
