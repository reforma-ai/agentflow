import { readFileSync, writeFileSync } from 'node:fs';

const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));

for (const path of ['plugin.json', '.claude-plugin/plugin.json']) {
  const manifest = JSON.parse(readFileSync(path, 'utf8'));

  if (manifest.version === packageJson.version) {
    continue;
  }

  manifest.version = packageJson.version;
  writeFileSync(path, `${JSON.stringify(manifest, null, 2)}\n`);
}
