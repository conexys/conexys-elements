# Conexys Components

Biblioteca de componentes React para proyectos Conexys.

## Instalación

```bash
npm install conexys-elements
# o usando yarn
yarn add conexys-elements
```

## Dependencias

Este paquete tiene como peer dependencies:

- react >= 18.0.0
- react-dom >= 18.0.0
- @mui/material >= 5.0.0
- @mui/icons-material >= 5.0.0
- axios >= 1.0.0
- react-i18next >= 12.0.0
- react-helmet-async >= 1.3.0
- react-router-dom >= 6.0.0
- sweetalert2 >= 11.0.0
- sweetalert2-react-content >= 5.0.0
- date-fns >= 2.28.0
- date-fns-tz >= 1.3.0
- react-select >= 5.0.0
- @fingerprintjs/fingerprintjs >= 3.3.0

Asegúrate de instalar estas dependencias en tu proyecto:

```bash
npm install react react-dom @mui/material @mui/icons-material axios react-i18next react-helmet-async react-router-dom sweetalert2 sweetalert2-react-content date-fns date-fns-tz react-select @fingerprintjs/fingerprintjs
```

## Uso

```jsx
import { Card, Loading, ActionButtons } from 'conexys-elements';

function MyComponent() {
  return (
    <div>
      <Card title="Mi Tarjeta">
        Contenido de la tarjeta
      </Card>
      
      <ActionButtons 
        onCancel={() => console.log('Cancelado')}
        onSubmit={() => console.log('Enviado')}
        cancelText="Cancelar"
        submitText="Enviar"
      />
    </div>
  );
}
```

## Inicialización de servicios compartidos

Para inicializar los servicios compartidos en tu aplicación:

```jsx
import { initializeSharedServices, initializeSharedComponents } from 'conexys-elements';

// En tu componente principal o archivo de inicialización
useEffect(() => {
  initializeSharedServices();
  initializeSharedComponents();
}, []);
```

## Archivos de idioma

El paquete incluye traducciones básicas en español y catalán. Para usarlas, configura i18next con la ruta correcta a los archivos de idioma que se encuentran en `node_modules/conexys-elements/dist/language/`.

## Licencia

MIT
