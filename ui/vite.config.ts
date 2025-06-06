import {fileURLToPath, URL} from 'node:url'
import type {ProxyOptions} from 'vite'
import {defineConfig, loadEnv} from 'vite'
import path from 'path'
import vue from '@vitejs/plugin-vue'
import DefineOptions from 'unplugin-vue-define-options/vite'
import {nodePolyfills } from 'vite-plugin-node-polyfill';

const envDir = './env'
// https://vitejs.dev/config/
export default defineConfig(({mode}) => {
    const ENV = loadEnv(mode, envDir)
    const prefix = process.env.VITE_DYNAMIC_PREFIX || ENV.VITE_BASE_PATH;
    const proxyConf: Record<string, string | ProxyOptions> = {}
    proxyConf['/api'] = {
        target: 'http://127.0.0.1:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(ENV.VITE_BASE_PATH, '/')
    }
    return {
        preflight: false,
        lintOnSave: false,
        base: prefix,
        envDir: envDir,
        plugins: [
            vue(),
            DefineOptions(),
            nodePolyfills()
        ],
        server: {
            cors: true,
            host: '0.0.0.0',
            port: Number(ENV.VITE_APP_PORT),
            strictPort: true,
            proxy: proxyConf
        },
        build: {
            outDir: 'dist/ui'
        },
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url)),
                '@assets': fileURLToPath(new URL('./src/assets', import.meta.url)),
                'openai-realtime-api-beta': path.resolve(__dirname, './src/views/chat/pc/lib/openai-realtime-api-beta')
            }
        }
    }
})
