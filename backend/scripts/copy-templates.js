const fs = require("fs");
const path = require("path");

const src = path.resolve(__dirname, "../src/templates");
const dest = path.resolve(__dirname, "../dist/templates");

if (fs.existsSync(src)) {
  fs.cpSync(src, dest, { recursive: true });
  console.log("[build] Copied templates to dist/templates");
} else {
  console.warn("[build] No src/templates found, skipping copy");
}
