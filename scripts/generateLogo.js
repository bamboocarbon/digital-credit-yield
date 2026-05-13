// Run once: node scripts/generateLogo.js
// Generates public/logo-tweet.png for use in daily tweets

import sharp from 'sharp';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dir = dirname(fileURLToPath(import.meta.url));

const svg = `
<svg width="1200" height="400" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="400" fill="#0a0f1e"/>

  <!-- Gold accent bar -->
  <rect x="80" y="155" width="16" height="90" rx="3" fill="#f5a623"/>

  <!-- Site name -->
  <text x="116" y="215" font-family="Arial, sans-serif" font-size="72" font-weight="700"
    letter-spacing="-1" fill="#ffffff">Digital Credit Yield</text>

  <!-- URL -->
  <text x="116" y="268" font-family="Arial, sans-serif" font-size="32" font-weight="400"
    fill="#f5a623">digitalcredityield.com</text>

  <!-- Bottom border line -->
  <rect x="0" y="390" width="1200" height="2" fill="#f5a623" opacity="0.3"/>
</svg>
`;

const outPath = join(__dir, '..', 'public', 'logo-tweet.png');

await sharp(Buffer.from(svg)).png().toFile(outPath);
console.log(`Logo saved to ${outPath}`);
