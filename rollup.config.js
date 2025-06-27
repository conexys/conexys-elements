import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';

export default {
  input: 'src/index.js',
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
      extensions: ['.js', '.jsx']
    }),
    commonjs(),
    babel({
      babelHelpers: 'bundled',
      exclude: 'node_modules/**',
      presets: ['@babel/preset-env', '@babel/preset-react'],
      extensions: ['.js', '.jsx']
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
    'date-fns-tz',
    'react-select',
    '@fingerprintjs/fingerprintjs',
    'react-cssfx-loading',
    'jodit-react',
    'react-hook-form',
    'material-react-table',
    'prop-types',
    'react-bootstrap',
    'react-icons',
    'react-transition-group',
    'dom-helpers',
    '@emotion/react',
    '@emotion/utils',
    '@emotion/styled',
    '@emotion/cache',
    '@emotion/serialize',
    '@emotion/sheet',
    '@emotion/css',
    '@emotion/is-prop-valid',
    '@emotion/unitless',
    '@emotion/hash',
    '@emotion/memoize',
    '@emotion/weak-memoize',
    '@emotion/stylis'
  ]
};
