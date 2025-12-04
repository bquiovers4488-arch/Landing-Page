import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        // EmailJS configuration for form email notifications
        'process.env.EMAILJS_SERVICE_ID': JSON.stringify(env.EMAILJS_SERVICE_ID),
        'process.env.EMAILJS_TEMPLATE_ID': JSON.stringify(env.EMAILJS_TEMPLATE_ID),
        'process.env.EMAILJS_PUBLIC_KEY': JSON.stringify(env.EMAILJS_PUBLIC_KEY),
        'process.env.RECIPIENT_EMAIL': JSON.stringify(env.RECIPIENT_EMAIL)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
