import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// GitHub Pages用設定
export default defineConfig({
  base: "/friend-bingo-app/", // リポジトリ名に合わせる
  plugins: [react()],
});
