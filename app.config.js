const appJson = require('./app.json');

module.exports = () => {
  const config = appJson.expo;
  const variant = process.env.APP_VARIANT;
  const internalVariant = ['development', 'preview'].includes(variant)
    ? variant
    : null;

  if (!internalVariant) {
    return config;
  }

  const variantLabel =
    internalVariant === 'development' ? 'Dev' : 'Preview';

  return {
    ...config,
    name: `${config.name} ${variantLabel}`,
    scheme: `${config.scheme}-${internalVariant}`,
    ios: {
      ...config.ios,
      bundleIdentifier: `${config.ios.bundleIdentifier}.${internalVariant}`,
    },
    android: {
      ...config.android,
      package: `${config.android.package}.${internalVariant}`,
    },
  };
};
