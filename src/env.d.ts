/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SDK_URL: string
  readonly VITE_API_KEY: string
  readonly VITE_INFURA_API_KEY: string
  readonly VITE_PRIVATE_KEY: string
  readonly VITE_ETHERSCAN_API_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
