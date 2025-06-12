# Guía para verificar y publicar el paquete conexys-elements

## 1. Verificar la estructura del proyecto

Tu estructura actual se ve correcta, con:
- Archivo `src/index.js` en la raíz de `src` que exporta todos los componentes
- Organización por carpetas (components, services, etc.)
- Configuración de Rollup para compilación

## 2. Instalar las dependencias de desarrollo

Ejecuta:

```bash
npm install
```

Esto instalará todas las dependencias de desarrollo definidas en tu `package.json`.

## 3. Verificar que no faltan dependencias

Revisa que todas las dependencias utilizadas en tu código estén declaradas en la sección `peerDependencies` de tu `package.json`. Según los archivos que veo, parece que ya están todas incluidas.

## 4. Ejecutar la compilación

```bash
npm run build
```

Este comando ejecutará el script de Rollup definido en tu `package.json` que compilará tu código en los formatos CommonJS y ESM en la carpeta `dist`.

## 5. Verificar que la compilación funciona correctamente

Después de compilar, verifica que en la carpeta `dist` tienes:
- `index.js` (versión CommonJS)
- `index.esm.js` (versión ESM)
- Archivos de mapas de fuente (sourcemaps)
- Carpeta `language` con las traducciones

## 6. Verificar el archivo .npmignore

Tu archivo `.npmignore` actual excluye correctamente los archivos de desarrollo. Asegúrate de que no estés excluyendo archivos necesarios para el funcionamiento del paquete.

## 7. Publicar localmente para pruebas (opcional)

Antes de publicar en NPM, puedes probar tu paquete localmente con:

```bash
npm pack
```

Esto generará un archivo `.tgz` que puedes instalar en otro proyecto para pruebas:

```bash
npm install ../ruta/al/conexys-elements-1.0.0.tgz
```

## 8. Actualizar la documentación

Asegúrate de que tu README.md contiene ejemplos actualizados de cómo utilizar los componentes y servicios.

## 9. Publicar en NPM (cuando estés listo)

```bash
npm login
npm publish
```

Si es tu primera versión, puedes publicarlo directamente. Si estás actualizando una versión existente, usa `npm version` para actualizar el número de versión antes de publicar.

## Ejemplo de uso del paquete

Una vez publicado, los usuarios podrán utilizar tu paquete así:

```jsx
import { Card, Loading, ActionButtons, initializeSharedServices } from 'conexys-elements';

// Inicializar servicios compartidos (una vez, en componente principal)
useEffect(() => {
  initializeSharedServices();
}, []);

// Usar componentes en tu aplicación
function MiComponente() {
  return (
    <Card title="Ejemplo">
      <Loading type="flex" />
      <ActionButtons 
        onSubmit={() => console.log("Guardado")}
        onCancel={() => console.log("Cancelado")}
        submitText="Guardar"
        cancelText="Cancelar"
      />
    </Card>
  );
}
```