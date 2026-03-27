import { writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import XLSX from "xlsx";

const __dirname = dirname(fileURLToPath(import.meta.url));
const filePath = join(__dirname, "..", "Univsersal AP Spec 20250513.xlsx");
const outPath = join(__dirname, "..", "data", "ap-matrix.json");

const wb = XLSX.readFile(filePath);
const ws = wb.Sheets["Sheet1"];

// Expand merged cells
for (const merge of ws["!merges"] || []) {
  const topLeft = XLSX.utils.encode_cell({ r: merge.s.r, c: merge.s.c });
  const cell = ws[topLeft];
  if (!cell) continue;
  for (let r = merge.s.r; r <= merge.e.r; r++) {
    for (let c = merge.s.c; c <= merge.e.c; c++) {
      const addr = XLSX.utils.encode_cell({ r, c });
      if (!ws[addr]) ws[addr] = { ...cell };
    }
  }
}

const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" });

function clean(v) {
  return String(v).replace(/\r\n/g, " / ").trim();
}

// Group rows by platform, collect descriptions
const map = new Map();

for (let i = 1; i < rows.length; i++) {
  const row = rows[i];
  const platform = clean(row[0]);
  if (!platform) continue;

  const desc = clean(row[1]);

  if (!map.has(platform)) {
    map.set(platform, {
      platform,
      descriptions: [],
      dram: clean(row[2]),
      norFlash: clean(row[3]),
      flash: clean(row[4]),
      cpu: clean(row[5]),
      radio: clean(row[6]),
    });
  }

  if (desc) map.get(platform).descriptions.push(desc);
}

const output = Array.from(map.values());

writeFileSync(outPath, JSON.stringify(output, null, 2), "utf-8");
console.log(`Written ${output.length} AP platforms to ${outPath}`);
