/// <reference types="vite/client" />

declare module "*.vue" {
  import { DefineComponent } from "vue";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_HTTPS_KEY_PATH: string;
  readonly VITE_HTTPS_CERT_PATH: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
