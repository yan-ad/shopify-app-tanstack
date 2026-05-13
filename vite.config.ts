import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {builtinModules} from 'node:module';

import {defineConfig} from 'vite';

import pkg from './package.json';

type PackageJsonDeps = {
  dependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
  optionalDependencies?: Record<string, string>;
};

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const adapterBasePath = path.resolve(__dirname, 'src/server/adapters');

const adapterEntries = fs
  .readdirSync(adapterBasePath, {withFileTypes: true})
  .filter((dirent) => dirent.isDirectory() && dirent.name !== '__tests__')
  .reduce<Record<string, string>>((entries, {name}) => {
    entries[`server/adapters/${name}/index`] = path.resolve(
      adapterBasePath,
      name,
      'index.ts',
    );

    return entries;
  }, {});

const input = {
  'server/index': path.resolve(__dirname, 'src/server/index.ts'),
  'server/test-helpers/index': path.resolve(
    __dirname,
    'src/server/test-helpers/index.ts',
  ),
  'react/index': path.resolve(__dirname, 'src/react/index.ts'),
  ...adapterEntries,
};

const externalPackageDeps = [
  ...Object.keys((pkg as PackageJsonDeps).dependencies ?? {}),
  ...Object.keys((pkg as PackageJsonDeps).peerDependencies ?? {}),
  ...Object.keys((pkg as PackageJsonDeps).optionalDependencies ?? {}),
];

const externalDeps = [
  ...externalPackageDeps,
  ...externalPackageDeps.map((dependencyName) =>
    new RegExp(`^${dependencyName.replace(/\//g, '\\/')}\\/`),
  ),
  ...builtinModules,
  ...builtinModules.map((moduleName) => `node:${moduleName}`),
];

export default defineConfig({
  build: {
    target: 'es2022',
    sourcemap: true,
    minify: 'oxc',
    emptyOutDir: false,
    outDir: 'dist/esm',
    rolldownOptions: {
      input,
      external: externalDeps,
      preserveEntrySignatures: 'strict',
      output: {
        format: 'es' as const,
        entryFileNames: '[name].mjs',
        chunkFileNames: 'chunks/[name]-[hash].mjs',
        exports: 'auto' as const,
      },
    },
  },
});
