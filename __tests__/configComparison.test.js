const { assertConfigVariants } = require('../scripts/compare-expo-configs');

const base = {
  name: 'FindYourFeeling',
  scheme: 'findyourfeeling',
  ios: { bundleIdentifier: 'com.plemoo.findyourfeeling' },
  android: { package: 'com.plemoo.findyourfeeling' },
  extra: { stable: true },
};

const variant = (suffix) => {
  const label = suffix === 'Development' ? 'Dev' : suffix;
  return {
    ...base,
    name: `FindYourFeeling ${label}`,
    scheme: `findyourfeeling-${suffix.toLowerCase()}`,
    ios: { ...base.ios, bundleIdentifier: `${base.ios.bundleIdentifier}.${suffix.toLowerCase()}` },
    android: { ...base.android, package: `${base.android.package}.${suffix.toLowerCase()}` },
  };
};

test('accepts only the documented development and preview identity differences', () => {
  expect(() =>
    assertConfigVariants({
      default: base,
      production: base,
      development: variant('Development'),
      preview: variant('Preview'),
      unknown: base,
    }),
  ).not.toThrow();
});

test('rejects unrelated configuration drift', () => {
  expect(() =>
    assertConfigVariants({
      default: base,
      production: base,
      development: { ...variant('Development'), extra: { stable: false } },
      preview: variant('Preview'),
      unknown: base,
    }),
  ).toThrow(/development configuration drift/);
});

test('rejects incorrect variant identity suffixes', () => {
  expect(() =>
    assertConfigVariants({
      default: base,
      production: base,
      development: variant('Wrong'),
      preview: variant('Preview'),
      unknown: base,
    }),
  ).toThrow(/development identity mismatch/);
});

test('rejects development and preview identity collisions', () => {
  const development = variant('Development');
  expect(() =>
    assertConfigVariants({
      default: base,
      production: base,
      development,
      preview: development,
      unknown: base,
    }),
  ).toThrow(/preview identity mismatch/);
});
