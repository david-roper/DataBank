import { config } from '@douglasneuroinformatics/eslint-config';

export default config({
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  react: {
    enabled: true,
    version: '18'
  },
  typescript: {
    enabled: true
  }
});
