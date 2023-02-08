import "regenerator-runtime/runtime.js";

import App from "@/components/Pages/App.svelte";

import "@/i18n";

const app = new App({
  target: document.body,
  hydrate: true,
});

export default app;
