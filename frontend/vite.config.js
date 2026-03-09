import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { compression } from 'vite-plugin-compression2';

export default defineConfig({
    plugins: [
        react(),
        compression({ algorithm: 'gzip', threshold: 1024 }),
        compression({ algorithm: 'brotliCompress', threshold: 1024 }),
    ],
    server: {
        port: 3000,
        host: '0.0.0.0',
        proxy: {
            '/api': {
                target: 'http://127.0.0.1:5000',
                changeOrigin: true,
                configure: (proxy) => {
                    proxy.on('proxyRes', (proxyRes) => {
                        // Strip HSTS header to prevent browser from forcing HTTPS on localhost
                        delete proxyRes.headers['strict-transport-security'];
                    });
                },
            },
        },
    },
    build: {
        target: 'es2020',
        cssMinify: true,
        minify: 'terser',
        terserOptions: {
            compress: { drop_console: true, drop_debugger: true },
        },
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['react', 'react-dom', 'react-router-dom'],
                    forms: ['react-hook-form'],
                },
            },
        },
        assetsInlineLimit: 4096,
    },
});
