// Runs after `npm install` (package.json "postinstall"). tesseract.js-core ships each WebAssembly build twice: the
// '<name>.js' + '<name>.wasm' pair Node loads, and a '<name>.wasm.js' copy with the wasm embedded as base64 for browsers
// (~4.7MB each, ~26MB total). We only use Tesseract server-side, but Next's file tracer follows tesseract.js's static
// requires into the '.wasm.js' files and ships them in every deployment's /api/thoughts function; with hundreds of retained
// deployments that helped fill Vercel's 10GB function-storage cap (Oct 2026). Deleting them from node_modules is the one
// approach that works regardless of build tool (outputFileTracingExcludes is not honoured by the Turbopack trace).
// Verified: OCR output is identical without them. Safe to re-run; does nothing if the package isn't installed.
import { readdirSync, rmSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const dir = fileURLToPath(new URL('../node_modules/tesseract.js-core/', import.meta.url));
if (existsSync(dir)) {
  let n = 0;
  for (const f of readdirSync(dir)) {
    if (/^tesseract-core[\w-]*\.wasm\.js$/.test(f)) { rmSync(dir + f); n++; }
  }
  if (n) console.log(`slimTesseractCore: removed ${n} browser-only .wasm.js files`);
}
