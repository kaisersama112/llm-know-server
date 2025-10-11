/// <reference types="vite/client" />
declare module 'katex'
interface Window {
  sendMessage: ?((message: string, other_params_data: any) => void)
  MaxKB: {
    prefix: string
    chatPrefix: string
  }
}
interface ImportMeta {
    readonly env: ImportMetaEnv
}

declare type Recordable<T = any> = Record<string, T>
