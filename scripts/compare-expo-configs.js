const fs = require('node:fs');
const assert = require('node:assert/strict');

const IDENTITY_PATHS = [
  ['name'],
  ['scheme'],
  ['ios', 'bundleIdentifier'],
  ['android', 'package'],
];

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function removePath(value, path) {
  let current = value;
  for (const segment of path.slice(0, -1)) {
    current = current?.[segment];
  }
  if (current) delete current[path.at(-1)];
}

function stripVariantIdentity(config) {
  const result = clone(config);
  for (const path of IDENTITY_PATHS) removePath(result, path);
  return result;
}

function assertConfigVariants(configs) {
  assert.deepStrictEqual(configs.production, configs.default, 'production configuration drift');
  assert.deepStrictEqual(configs.unknown, configs.default, 'unknown-variant configuration drift');

  for (const name of ['development', 'preview']) {
    assert.deepStrictEqual(
      stripVariantIdentity(configs[name]),
      stripVariantIdentity(configs.default),
      `${name} configuration drift outside documented identity fields`,
    );

    const label = name === 'development' ? 'Dev' : 'Preview';
    const identity = {
      name: configs[name].name,
      scheme: configs[name].scheme,
      bundleIdentifier: configs[name].ios?.bundleIdentifier,
      androidPackage: configs[name].android?.package,
    };
    assert.deepStrictEqual(
      identity,
      {
        name: `${configs.default.name} ${label}`,
        scheme: `${configs.default.scheme}-${name}`,
        bundleIdentifier: `${configs.default.ios.bundleIdentifier}.${name}`,
        androidPackage: `${configs.default.android.package}.${name}`,
      },
      `${name} identity mismatch`,
    );
  }
}

function loadConfig(path) {
  return JSON.parse(fs.readFileSync(path, 'utf8'));
}

if (require.main === module) {
  const [defaultPath, productionPath, developmentPath, previewPath, unknownPath] = process.argv.slice(2);
  if (!unknownPath) {
    throw new Error('usage: compare-expo-configs <default> <production> <development> <preview> <unknown>');
  }
  assertConfigVariants({
    default: loadConfig(defaultPath),
    production: loadConfig(productionPath),
    development: loadConfig(developmentPath),
    preview: loadConfig(previewPath),
    unknown: loadConfig(unknownPath),
  });
  console.log('Expo configuration variants match documented invariants.');
}

module.exports = { assertConfigVariants };
