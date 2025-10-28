#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const sbomPath = path.join(root, 'sbom.json');
const pkgPath = path.join(root, 'package.json');

function safeReadJSON(p) {
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch (e) {
    console.error('Failed to read/parse', p, e.message);
    process.exit(2);
  }
}

// Simple CLI args: --limit <n> or -n <n> to limit how many packages to add
const argv = process.argv.slice(2);
let limit = Infinity;
let versionStyle = 'exact'; // 'exact' | 'asterisk' | 'caret'
for (let i = 0; i < argv.length; i++) {
  const a = argv[i];
  if (a === '--limit' || a === '-n') {
    const val = argv[i + 1];
    if (val == null || Number.isNaN(Number(val))) {
      console.error('Invalid or missing value for --limit');
      process.exit(2);
    }
    limit = Math.max(0, Number(val));
    i++;
  } else if (a === '--no-versions') {
    versionStyle = 'asterisk';
  } else if (a === '--caret') {
    versionStyle = 'caret';
  }
}

const sbom = safeReadJSON(sbomPath);
const pkg = safeReadJSON(pkgPath);

if (!Array.isArray(sbom.components)) {
  console.error('No components array found in sbom.json');
  process.exit(3);
}

pkg.dependencies = pkg.dependencies || {};

const seen = new Map();
let added = 0;
let skippedExisting = 0;
let processed = 0;

for (const comp of sbom.components) {
  const purl = comp && comp.purl;
  if (typeof purl !== 'string') continue;
  if (!purl.startsWith('pkg:npm/')) continue;

  // Remove prefix
  let tail = purl.slice('pkg:npm/'.length);
  // strip qualifiers after ? if any
  const q = tail.indexOf('?');
  if (q !== -1) tail = tail.slice(0, q);
  // find last @ (separates name and version)
  const lastAt = tail.lastIndexOf('@');
  if (lastAt <= 0) continue; // defensive
  const namePart = tail.slice(0, lastAt);
  const version = tail.slice(lastAt + 1);
  if (!namePart) continue;
  const name = decodeURIComponent(namePart);
  if (!name) continue;

  // Avoid reprocessing same name/version pair
  const key = `${name}@${version}`;
  if (seen.has(key)) continue;
  seen.set(key, true);
  // stop if we've reached the requested limit
  if (processed >= limit) break;
  processed++;

  // If name already exists in package.json dependencies, skip adding
  if (Object.prototype.hasOwnProperty.call(pkg.dependencies, name)) {
    skippedExisting++;
    continue;
  }

  // Add to dependencies using requested style
  let depVersion;
  if (versionStyle === 'asterisk') {
    depVersion = '*';
  } else if (versionStyle === 'caret') {
    depVersion = `^${version}`;
  } else {
    depVersion = version;
  }
  pkg.dependencies[name] = depVersion;
  added++;
}

// Backup original package.json
const backupPath = pkgPath + '.sbom.bak';
fs.writeFileSync(backupPath, JSON.stringify(safeReadJSON(pkgPath), null, 2) + '\n', 'utf8');

// Write updated package.json
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n', 'utf8');

console.log(`Done. Added ${added} dependencies. Skipped ${skippedExisting} already-existing deps. Backup written to ${backupPath}`);
process.exit(0);
