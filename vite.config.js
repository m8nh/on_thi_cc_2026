import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // IMPORTANTE: troque "REPO-NAME" pelo nome exato do seu repositório no GitHub
  // (ex: se o repo for github.com/minh/trilha-do-aprovado, use "/trilha-do-aprovado/").
  // Se você for publicar em um domínio próprio (ou em usuario.github.io), pode deixar "/".
  base: "/on_thi_cc_2026/",
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
  },
});
