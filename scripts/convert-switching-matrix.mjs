import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import XLSX from "xlsx";

const __dirname = dirname(fileURLToPath(import.meta.url));
const filePath = join(__dirname, "..", "Universal_Switches_with_X435_Matrix_20251228.xlsx");
const outPath = join(__dirname, "..", "data", "switching-matrix.json");

const wb = XLSX.readFile(filePath);
const ws = wb.Sheets["Sheet1"];

// Expand merged cells: copy top-left cell value into every cell of each merge range
for (const merge of ws["!merges"] || []) {
  const topLeftAddr = XLSX.utils.encode_cell({ r: merge.s.r, c: merge.s.c });
  const topLeftCell = ws[topLeftAddr];
  if (!topLeftCell) continue;
  for (let r = merge.s.r; r <= merge.e.r; r++) {
    for (let c = merge.s.c; c <= merge.e.c; c++) {
      const addr = XLSX.utils.encode_cell({ r, c });
      if (!ws[addr]) {
        ws[addr] = { ...topLeftCell };
      }
    }
  }
}

const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" });

// Row index 2 (0-based) = sub-headers (col names)
const colHeaders = rows[2];

// Column index map
const COL = {
  product: 0,
  sku: 1,
  competitors: 2,
  // Interface cols 3–19, Spec cols 20–34
};

const INTERFACE_COLS = [3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19];
const SPEC_COLS = [20,21,22,23,24,25,26,27,28,29,30,31,32,33,34];

function cleanVal(v) {
  if (v === "" || v === null || v === undefined) return "";
  return String(v).replace(/\r\n/g, " / ").trim();
}

const output = [];
let currentProduct = "";

for (let i = 3; i < rows.length; i++) {
  const row = rows[i];
  // Skip footnote/empty rows
  const sku = cleanVal(row[COL.sku]);
  if (!sku) continue;

  // Fill-down product name from merged cells
  if (row[COL.product] !== "") {
    currentProduct = cleanVal(row[COL.product]);
  }

  const interfaces = {};
  for (const ci of INTERFACE_COLS) {
    const label = cleanVal(colHeaders[ci]);
    if (label) interfaces[label] = cleanVal(row[ci]);
  }

  const specs = {};
  for (const ci of SPEC_COLS) {
    const label = cleanVal(colHeaders[ci]);
    if (label) specs[label] = cleanVal(row[ci]);
  }

  output.push({
    product: currentProduct,
    sku,
    competitors: cleanVal(row[COL.competitors]),
    interfaces,
    specs,
  });
}

writeFileSync(outPath, JSON.stringify(output, null, 2), "utf-8");
console.log(`Written ${output.length} SKU rows to ${outPath}`);
