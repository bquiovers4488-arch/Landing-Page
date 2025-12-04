/// <reference types="vite/client" />

declare namespace NodeJS {
  interface ProcessEnv {
    API_KEY: string;
    GEMINI_API_KEY: string;
    EMAILJS_SERVICE_ID: string;
    EMAILJS_TEMPLATE_ID: string;
    EMAILJS_PUBLIC_KEY: string;
    RECIPIENT_EMAIL: string;
  }
}
