import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.js',
      format: 'cjs',
      sourcemap: true
    },
    {
      file: 'dist/index.esm.js',
      format: 'esm',
      sourcemap: true
    }
  ],
  plugins: [
    peerDepsExternal(),
    resolve({
      extensions: ['.js', '.jsx', '.ts', '.tsx']
    }),
    commonjs(),
    typescript({
      tsconfig: './tsconfig.json',
      declaration: true,
      declarationDir: 'dist'
    }),
    babel({
      babelHelpers: 'bundled',
      exclude: 'node_modules/**',
      presets: [
        '@babel/preset-env', 
        '@babel/preset-react',
        '@babel/preset-typescript'
      ],
      extensions: ['.js', '.jsx', '.ts', '.tsx']
    }),
    postcss({
        extract: true, // Extrae el CSS a un archivo separado
        minimize: true, // Minifica el CSS
        sourceMap: true, // Genera un sourcemap para el CSS
    })
  ],
  external: [
    'react', 
    'react-dom', 
    '@mui/material', 
    '@mui/icons-material', 
    'axios', 
    'react-i18next',
    'react-helmet-async',
    'react-router-dom',
    'sweetalert2',
    'sweetalert2-react-content',
    'date-fns',
    'react-select',
    '@fingerprintjs/fingerprintjs',
    'jodit-react',
    'react-hook-form',
    'material-react-table',
    'prop-types',
    'react-bootstrap',
    'react-icons',
    'react-transition-group',
    'dom-helpers'
  ]
};
