import { buildXDC, eruda, mockWebxdc } from "@webxdc/vite-plugins";
import preact from "@preact/preset-vite";
import Icons from "unplugin-icons/vite";
import { defineConfig } from "vite";
import path from "path";
import { promises as fs } from "node:fs";
import { execSync } from "child_process";

function getVersion(): string {
  try {
    return execSync("git describe --tags", {
      stdio: ["ignore", "pipe", "ignore"],
    })
      .toString()
      .trim();
  } catch {
    return "v0.0.0";
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    preact(),
    buildXDC(),
    eruda(),
    mockWebxdc(),
    Icons({
      compiler: "jsx",
      jsx: "react",
      customCollections: {
        custom: {
          "party-popper": () => fs.readFile("./img/party-popper.svg", "utf-8"),
        },
      },
    }),
  ],
  define: {
    __APP_VERSION__: JSON.stringify(getVersion()),
  },
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "./src"),
      "@sfx": path.resolve(__dirname, "./sfx"),
      "@img": path.resolve(__dirname, "./img"),
    },
  },
});
