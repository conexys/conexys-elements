# Conexys Components

React component library for Conexys projects.

> 🚀 **Now with TypeScript support!** This project is in the process of migrating to TypeScript for a better development experience and type safety.

## Installation

```bash
npm install conexys-elements
# or using yarn
yarn add conexys-elements
```

## Dependencies

This package has the following peer dependencies:

- @fingerprintjs/fingerprintjs >= 5.0.1
- @mui/icons-material >= 7.3.7
- @mui/material >= 7.3.7
- axios >= 1.13.2
- date-fns >= 4.1.0
- jodit-react >= 5.2.38
- react >= 19.2.3
- react-dom >= 19.2.3
- react-helmet-async >= 2.0.5
- react-hook-form >= 7.71.1
- react-i18next >= 16.5.3
- react-router-dom >= 7.12.0
- react-select >= 5.10.2
- react-transition-group >= 4.4.5
- sweetalert2 >= 11.26.17
- sweetalert2-react-content >= 5.1.1

Make sure to install these dependencies in your project:

```bash
npm install react react-dom @mui/material @mui/icons-material axios react-i18next react-helmet-async react-router-dom sweetalert2 sweetalert2-react-content date-fns jodit-react react-select react-hook-form react-transition-group @fingerprintjs/fingerprintjs
```

## Usage

### JavaScript

```jsx
import { Card, Loading, ActionButtons } from 'conexys-elements';

function MyComponent() {
  return (
    <div>
      <Card title="My Card">
        Card content
      </Card>
      
      <ActionButtons 
        onCancel={() => console.log('Cancelled')}
        onSubmit={() => console.log('Submitted')}
        cancelText="Cancel"
        submitText="Submit"
      />
    </div>
  );
}
```

## Initializing Shared Services

To initialize shared services in your application:

```jsx
import { initializeSharedServices, initializeSharedComponents } from 'conexys-elements';

// In your main component or initialization file
useEffect(() => {
  initializeSharedServices();
  initializeSharedComponents();
}, []);
```

### TypeScript

```tsx
import { Card, Loading, ActionButtons } from 'conexys-elements';
import type { ButtonProps } from 'conexys-elements';

function MyComponent() {
  return (
    <div>
      <Card title="My Card">
        Card content
      </Card>
      
      <ActionButtons 
        onCancel={() => console.log('Cancelled')}
        onSubmit={() => console.log('Submitted')}
        cancelText="Cancel"
        submitText="Submit"
      />
    </div>
  );
}
```

Types are automatically included, and your IDE will provide full autocompletion.

## Language Files

The package includes basic translations in Spanish and Catalan. To use them, configure i18next with the correct path to the language files located in `node_modules/conexys-elements/dist/language/`.

## Development

### Migration to TypeScript

This project is in the process of migrating to TypeScript. For more information about the migration process, see [MIGRACION_TYPESCRIPT.md](./MIGRACION_TYPESCRIPT.md).

### Available Scripts

- `npm run build` - Compiles the project
- `npm run type-check` - Checks TypeScript types without compiling
- `npm run type-check:watch` - Checks types in watch mode

## License

MIT
