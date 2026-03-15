import nextVitals from 'eslint-config-next/core-web-vitals';

const config = [
  {
    ignores: ['.next/**', 'dist/**', 'node_modules/**', 'out/**']
  },
  ...nextVitals
];

export default config;
