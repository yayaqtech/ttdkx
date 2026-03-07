import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';
import tailwind from '@astrojs/tailwind';

// loadEnv reads .env files; process.env catches CI environment variables.
// process.env takes priority so GitHub Actions vars override .env.
const fileEnv = loadEnv(process.env.NODE_ENV ?? 'production', process.cwd(), '');

const SITE_URL = process.env.SITE_URL || fileEnv.SITE_URL || 'https://yayaqtech.github.io';
const BASE_PATH = process.env.BASE_PATH || fileEnv.BASE_PATH || '/ttdkx';

export default defineConfig({
  site: SITE_URL,
  base: BASE_PATH,
  output: 'static',
  integrations: [tailwind({ applyBaseStyles: false })],
});
