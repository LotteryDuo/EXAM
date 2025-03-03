import { renderToString } from "@vue/server-renderer";
import { createVueApp } from "./main.js"; // Correct import

export async function render(url) {
  const app = createVueApp(); // Use the function from main.js
  const ctx = {};

  const html = await renderToString(app, ctx);
  return { html, ctx };
}
