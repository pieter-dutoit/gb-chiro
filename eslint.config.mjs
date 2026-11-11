import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';
const config = [
  ...nextVitals, ...nextTypescript,
  { ignores: ['node_modules/**', '.next/**', 'out/**', 'build/**', 'next-env.d.ts', 'src/payload-types.ts', 'src/app/(payload)/admin/importMap.js', 'src/migrations/**'] },
];
export default config;
