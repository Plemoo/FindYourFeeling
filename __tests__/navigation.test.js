const path = require('path');

// Exercise Expo Linking's platform parser without the native manifest mock used
// by jest-expo. The native parser depends on an injected runtime linkingUri;
// the web parser accepts the same app URLs and covers URL decoding directly.
const linkingRoot = path.dirname(require.resolve('expo-linking/package.json'));
const Linking = require(path.join(linkingRoot, 'build/createURL.web.js'));

describe('SDK 58 routing and linking compatibility', () => {
  test.each([
    ['myapp:///', '/'],
    ['myapp:///FeelingsTracker', '/FeelingsTracker'],
    ['myapp-development:///FeelingsTracker', '/FeelingsTracker'],
    ['myapp-preview:///FeelingsTracker', '/FeelingsTracker'],
  ])('parses the supported deep link %s', (url, expectedPath) => {
    const parsed = Linking.parse(url);

    expect(`/${parsed.path ?? ''}`).toBe(expectedPath);
    expect(parsed.queryParams).toEqual({});
  });

  test('decodes a valid route query without changing the route', () => {
    const parsed = Linking.parse(
      'myapp:///FeelingsTracker?feeling=gl%C3%BCcklich&intensity=5'
    );

    expect(parsed.path).toBe('FeelingsTracker');
    expect(parsed.queryParams).toEqual({
      feeling: 'glücklich',
      intensity: '5',
    });
  });

  test.each([
    'myapp:///FeelingsTracker?feeling=%',
    'myapp:///FeelingsTracker?feeling=%E0%A4%A',
    'myapp:///FeelingsTracker?feeling=%25%25%25',
  ])('handles malformed query input without throwing: %s', (url) => {
    expect(() => Linking.parse(url)).not.toThrow();
    expect(Linking.parse(url).path).toBe('FeelingsTracker');
  });

  test('keeps route names aligned with the file-based router', () => {
    expect(Linking.parse('myapp:///').path).toBe('');
    expect(Linking.parse('myapp:///FeelingsTracker').path).toBe(
      'FeelingsTracker'
    );
  });
});