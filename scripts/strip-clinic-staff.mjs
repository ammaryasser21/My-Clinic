import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const p = path.join(__dirname, "../templates/clinic-page/clinic-page.html");
let s = fs.readFileSync(p, "utf8");
const open = '<div class="doctors-box-clinic">';
const start = s.indexOf(open);
const endMarker = /\r?\n\s*<div class="about-box-clinic">/;
const m = s.slice(start).match(endMarker);
if (!m || start < 0) {
  console.error("no match", start);
  process.exit(1);
}
const end = start + m.index;
const replacement =
  '<div class="doctors-box-clinic" id="y-clinic-staff"></div>\n              ';
const out = s.slice(0, start) + replacement + s.slice(end);
fs.writeFileSync(p, out);
console.log("clinic staff ok");
