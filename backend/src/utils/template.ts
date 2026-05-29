import fs from "fs";
import path from "path";

const TEMPLATES_DIR = path.join(__dirname, "..", "templates", "emails");

export function renderTemplate(
  templateName: string,
  vars: Record<string, string>
): string {
  const filePath = path.join(TEMPLATES_DIR, templateName);
  let html = fs.readFileSync(filePath, "utf-8");

  for (const [key, value] of Object.entries(vars)) {
    html = html.replaceAll(`{{${key}}}`, value);
  }

  return html;
}
