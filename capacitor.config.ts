import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.cms.app',
  appName: 'cms-tokyo-andchat',
  webDir: 'dist/cms-tokyo-andchat/browser',
  plugins: {
    VolumeButtons: {
      enabled: true,  // Asegura que el plugin está habilitado
    },
  },
  server: {
    androidScheme: 'https',  // Permite conexión segura con localhost
  },
  android: {
    allowMixedContent: true,  // Para permitir contenido mixto (HTTP y HTTPS)
    webContentsDebuggingEnabled: true,  // Habilitar la depuración en webview
  },
};

export default config;
