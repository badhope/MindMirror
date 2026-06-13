import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const REPO_NAME = 'MindMirror';
const DEFAULT_BASE = `/${REPO_NAME}/`;

export default defineConfig(({ mode }) => {
  const base = process.env.VITE_BASE_PATH || DEFAULT_BASE;
  return {
    base: mode === 'static' ? './' : base,
    plugins: [react()],
    resolve: {
      // 防御性配置：强制所有依赖使用顶层 React，避免嵌套依赖导致多实例
      dedupe: ['react', 'react-dom', 'react/jsx-runtime', 'use-sync-external-store'],
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks(id) {
            // 关键修复：把 zustand 与 react 合并到同一块，避免两个 React 实例
            // 两个 React 实例会导致 "Invalid hook call" / "Minified React error #310"
            if (
              id.includes('node_modules/react/') ||
              id.includes('node_modules/react-dom/') ||
              id.includes('node_modules/zustand') ||
              id.includes('node_modules/scheduler') ||
              id.includes('node_modules/use-sync-external-store')
            ) {
              return 'vendor-react';
            }
          },
        },
      },
    },
    server: {
      host: '0.0.0.0',
      port: 5173,
    },
    preview: {
      host: '0.0.0.0',
      port: 4173,
    },
  };
});
