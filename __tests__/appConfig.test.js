const appJson = require('../app.json');
const configureApp = require('../app.config');

const baseConfig = appJson.expo;
const originalVariant = process.env.APP_VARIANT;

afterEach(() => {
  if (originalVariant === undefined) {
    delete process.env.APP_VARIANT;
  } else {
    process.env.APP_VARIANT = originalVariant;
  }
});

describe('app configuration variants', () => {
  test.each([undefined, 'production', 'unexpected'])(
    'preserves the base configuration for APP_VARIANT=%s',
    (variant) => {
      if (variant === undefined) {
        delete process.env.APP_VARIANT;
      } else {
        process.env.APP_VARIANT = variant;
      }

      expect(configureApp({ config: baseConfig })).toBe(baseConfig);
    }
  );

  test.each([
    [
      'development',
      'Dev',
      'myapp-development',
      'com.plemo.FindYourFeeling.development',
      'com.plemo.FindeDeinGefuehl.development',
    ],
    [
      'preview',
      'Preview',
      'myapp-preview',
      'com.plemo.FindYourFeeling.preview',
      'com.plemo.FindeDeinGefuehl.preview',
    ],
  ])(
    'applies the %s identity suffix without changing shared configuration',
    (variant, label, scheme, bundleIdentifier, androidPackage) => {
      process.env.APP_VARIANT = variant;

      const result = configureApp({ config: baseConfig });

      expect(result).toEqual({
        ...baseConfig,
        name: `${baseConfig.name} ${label}`,
        scheme,
        ios: {
          ...baseConfig.ios,
          bundleIdentifier,
        },
        android: {
          ...baseConfig.android,
          package: androidPackage,
        },
      });
      expect(result.extra).toBe(baseConfig.extra);
      expect(result.plugins).toBe(baseConfig.plugins);
    }
  );
});
