import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const p = path.join(__dirname, "../templates/clinics/clinics.html");
let s = fs.readFileSync(p, "utf8");
const open = '<div class="doctors-box-clinic">';
const start = s.indexOf(open);
const rest = s.slice(start);
const endBlock =
  /\r?\n\s*<\/div>\r?\n\s*<button class="btn main-button center">اعرض المزيد<\/button>/;
const m = rest.match(endBlock);
if (!m || start < 0) {
  console.error("no match", start);
  process.exit(1);
}
const end = start + m.index + m[0].length;
const replacement =
  '<div class="doctors-box-clinic" id="y-clinics-list"></div>' +
  m[0].replace("<button", '<button type="button" hidden');
const out = s.slice(0, start) + replacement + s.slice(end);
fs.writeFileSync(p, out);
console.log("clinics ok");
