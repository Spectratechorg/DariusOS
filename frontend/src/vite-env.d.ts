/// <reference types="vite/client" />

declare module '@mui/icons-material/*';
declare module '@mui/icons-material';

interface ImportMetaEnv {
  readonly VITE_API_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
