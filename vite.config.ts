import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    // Only expose environment variables prefixed with VITE_ to the client bundle.
    // Supabase public keys (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY) use this prefix.
    envPrefix: 'VITE_',
    resolve: {
      alias: {
        // @/ maps to the src/ directory — use for all component/page imports.
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
