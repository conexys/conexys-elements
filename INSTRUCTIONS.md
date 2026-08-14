# Guide to Verify and Publish the conexys-elements Package

## 1. Verify the Project Structure

Your current structure looks correct, with:
- `src/index.js` file in the root of `src` exporting all components
- Folder organization (components, services, etc.)
- Rollup configuration for compilation

## 2. Install Development Dependencies

Run:

```bash
npm install
```

This will install all development dependencies defined in your `package.json`.

## 3. Check for Missing Dependencies

Ensure that all dependencies used in your code are declared in the `peerDependencies` section of your `package.json`. Based on the files I see, it seems that all are already included.

## 4. Run the Build

```bash
npm run build
```

This command will execute the Rollup script defined in your `package.json` to compile your code into CommonJS and ESM formats in the `dist` folder.

## 5. Verify the Build Works Correctly

After building, check that the `dist` folder contains:
- `index.js` (CommonJS version)
- `index.esm.js` (ESM version)
- Source map files (sourcemaps)
- `language` folder with translations

## 6. Verify the .npmignore File

Your current `.npmignore` file correctly excludes development files. Make sure you are not excluding files necessary for the package to work.

## 7. Publish Locally for Testing (Optional)

Before publishing to NPM, you can test your package locally with:

```bash
npm pack
```

This will generate a `.tgz` file that you can install in another project for testing:

```bash
npm install ../path/to/conexys-elements-1.0.0.tgz
```

## 8. Update the Documentation

Ensure that your README.md contains updated examples of how to use the components and services.

## 9. Publish to NPM (When Ready)

```bash
npm login
npm publish
```

If this is your first version, you can publish it directly. If you are updating an existing version, use `npm version` to update the version number before publishing.

## Example of Package Usage

Once published, users will be able to use your package like this:

```jsx
import { Card, Loading, ActionButtons, initializeSharedServices } from 'conexys-elements';

// Initialize shared services (once, in the main component)
useEffect(() => {
  initializeSharedServices();
}, []);

// Use components in your application
function MyComponent() {
  return (
    <Card title="Example">
      <Loading type="flex" />
      <ActionButtons 
        onSubmit={() => console.log("Saved")}
        onCancel={() => console.log("Cancelled")}
        submitText="Save"
        cancelText="Cancel"
      />
    </Card>
  );
}
```

Using environment variables (e.g., App.tsx)
```jsx
import { ConexysConfigProvider } from 'conexys-elements';

function App() {
    return (
        <ConexysConfigProvider config={{
            enableLogs: import.meta.env.VITE_SHOW_CONSOLE === 'true',
            enableLogsError: import.meta.env.VITE_SHOW_CONSOLE_ERROR === 'true',
            enableLogsWarning: import.meta.env.VITE_SHOW_CONSOLE_WARNING === 'true',
            enableLogsInfo: import.meta.env.VITE_SHOW_CONSOLE_INFO === 'true',
            enableLogsData: import.meta.env.VITE_SHOW_CONSOLE_DATA === 'true',
            developmentMode: import.meta.env.VITE_DEVELOPMENT_MODE === 'true'
        }}>
            {/* App components */}
        </ConexysConfigProvider>
    );
}
```