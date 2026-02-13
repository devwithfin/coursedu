#!/usr/bin/env node

/**
 * Converts any symlinks inside node_modules .bin directories (including nested packages)
 * into regular executable files.
 * This keeps the workspace interoperable when running npm scripts from Windows
 * (which cannot lstat Linux-style symlinks created inside WSL).
 */

const fs = require('fs/promises');
const path = require('path');

function buildMissingTargetShim(targetPath) {
  return `#!/usr/bin/env node

console.error('Executable target not found: ${targetPath}');
console.error('Reinstall dependencies to restore this command.');
process.exit(1);
`;
}

async function rewriteSymlinksInBin(binDir) {
  let entries;
  try {
    entries = await fs.readdir(binDir);
  } catch {
    return;
  }

  await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(binDir, entry);

      let stats;
      try {
        stats = await fs.lstat(fullPath);
      } catch {
        return;
      }

      if (!stats.isSymbolicLink()) {
        return;
      }

      try {
        const linkTarget = await fs.readlink(fullPath);
        const resolvedTarget = path.resolve(binDir, linkTarget);
        let fileContent;

        try {
          fileContent = await fs.readFile(resolvedTarget);
        } catch (readError) {
          if (readError.code === 'ENOENT') {
            await fs.unlink(fullPath);
            await fs.writeFile(fullPath, buildMissingTargetShim(resolvedTarget), {
              mode: 0o777,
            });
            return;
          }
          throw readError;
        }

        await fs.unlink(fullPath);
        await fs.writeFile(fullPath, fileContent, { mode: 0o777 });
      } catch (error) {
        console.warn(`Unable to rewrite ${fullPath}: ${error.message}`);
      }
    })
  );
}

async function gatherPackageNodeModules(workspaceRoot) {
  const directoriesToVisit = [workspaceRoot];
  const discoveredNodeModules = new Set();

  while (directoriesToVisit.length > 0) {
    const currentDir = directoriesToVisit.pop();
    let entries;
    try {
      entries = await fs.readdir(currentDir, { withFileTypes: true });
    } catch {
      continue;
    }

    const hasPackageJson = entries.some(
      (entry) => entry.isFile() && entry.name === 'package.json'
    );

    if (hasPackageJson) {
      const nodeModulesPath = path.join(currentDir, 'node_modules');
      try {
        const stats = await fs.stat(nodeModulesPath);
        if (stats.isDirectory()) {
          discoveredNodeModules.add(nodeModulesPath);
        }
      } catch {
        // ignore missing node_modules for packages that have not been installed yet
      }
    }

    for (const entry of entries) {
      if (!entry.isDirectory()) {
        continue;
      }

      if (entry.name === 'node_modules' || entry.name.startsWith('.')) {
        continue;
      }

      directoriesToVisit.push(path.join(currentDir, entry.name));
    }
  }

  return [...discoveredNodeModules];
}

async function processNodeModulesTree(rootNodeModules) {
  const queue = [rootNodeModules];

  while (queue.length > 0) {
    const currentNodeModules = queue.pop();
    let entries;
    try {
      entries = await fs.readdir(currentNodeModules, { withFileTypes: true });
    } catch {
      continue;
    }

    for (const entry of entries) {
      if (!entry.isDirectory()) {
        continue;
      }

      const fullPath = path.join(currentNodeModules, entry.name);

      if (entry.name === '.bin') {
        await rewriteSymlinksInBin(fullPath);
        continue;
      }

      if (entry.name.startsWith('.')) {
        continue;
      }

      if (entry.name.startsWith('@')) {
        let scopedPackages;
        try {
          scopedPackages = await fs.readdir(fullPath, { withFileTypes: true });
        } catch {
          continue;
        }

        for (const scopedEntry of scopedPackages) {
          if (!scopedEntry.isDirectory()) {
            continue;
          }

          const packageDir = path.join(fullPath, scopedEntry.name);
          const nestedNodeModules = path.join(packageDir, 'node_modules');
          try {
            const stats = await fs.stat(nestedNodeModules);
            if (stats.isDirectory()) {
              queue.push(nestedNodeModules);
            }
          } catch {
            // ignore
          }
        }

        continue;
      }

      const nestedNodeModules = path.join(fullPath, 'node_modules');
      try {
        const stats = await fs.stat(nestedNodeModules);
        if (stats.isDirectory()) {
          queue.push(nestedNodeModules);
        }
      } catch {
        // ignore
      }
    }
  }
}

async function fixBinLinks() {
  const workspaceRoot = process.cwd();
  const nodeModulesDirs = await gatherPackageNodeModules(workspaceRoot);

  for (const nodeModulesPath of nodeModulesDirs) {
    await processNodeModulesTree(nodeModulesPath);
  }
}

fixBinLinks();
