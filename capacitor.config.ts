import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.teakids.app',
  appName: 'TEA Kids',
  webDir: 'dist',
  plugins: {
    TextToSpeech: {
      language: 'pt-BR'
    }
  }
};

export default config;
