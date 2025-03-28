import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    lib: {
      entry: './src/index.ts',
      formats: ['es'],
    },
    outDir: '../dist-react',
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      external: ['react', 'react-jsx-runtime', 'zustand'],
    },
  },
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
      outputDir: '../dist-react/types',
    }),
  ],
});
