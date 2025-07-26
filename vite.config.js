import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/friend-bingo-app/",  // ←リポジトリ名に合わせる
  plugins: [react()],
});
