"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = loadMetroConfig;
function _fs() {
  const data = _interopRequireDefault(require("fs"));
  _fs = function () {
    return data;
  };
  return data;
}
function _path() {
  const data = _interopRequireDefault(require("path"));
  _path = function () {
    return data;
  };
  return data;
}
function _metroConfig() {
  const data = require("metro-config");
  _metroConfig = function () {
    return data;
  };
  return data;
}
function _cliTools() {
  const data = require("@react-native-community/cli-tools");
  _cliTools = function () {
    return data;
  };
  return data;
}
var _getDefaultMetroConfig = _interopRequireDefault(require("./getDefaultMetroConfig"));
var _metroPlatformResolver = require("./metroPlatformResolver");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * Get the config options to override based on RN CLI inputs.
 */
function getOverrideConfig(ctx) {
  const outOfTreePlatforms = Object.keys(ctx.platforms).filter(platform => ctx.platforms[platform].npmPackageName);
  const resolver = {
    platforms: [...Object.keys(ctx.platforms), 'native']
  };
  if (outOfTreePlatforms.length) {
    resolver.resolveRequest = (0, _metroPlatformResolver.reactNativePlatformResolver)(outOfTreePlatforms.reduce((result, platform) => {
      result[platform] = ctx.platforms[platform].npmPackageName;
      return result;
    }, {}));
  }
  return {
    resolver,
    serializer: {
      // We can include multiple copies of InitializeCore here because metro will
      // only add ones that are already part of the bundle
      getModulesRunBeforeMainModule: () => [require.resolve(_path().default.join(ctx.reactNativePath, 'Libraries/Core/InitializeCore')), ...outOfTreePlatforms.map(platform => require.resolve(`${ctx.platforms[platform].npmPackageName}/Libraries/Core/InitializeCore`, {
        paths: [ctx.root]
      }))]
    }
  };
}
/**
 * Load Metro config.
 *
 * Allows the CLI to override select values in `metro.config.js` based on
 * dynamic user options in `ctx`.
 */
async function loadMetroConfig(ctx, options = {}) {
  const overrideConfig = getOverrideConfig(ctx);
  if (options.reporter) {
    overrideConfig.reporter = options.reporter;
  }
  const cwd = ctx.root;
  const projectConfig = await (0, _metroConfig().resolveConfig)(options.config, cwd);
  if (projectConfig.isEmpty) {
    throw new (_cliTools().CLIError)(`No Metro config found in ${cwd}`);
  }
  _cliTools().logger.debug(`Reading Metro config from ${projectConfig.filepath}`);
  if (!global.__REACT_NATIVE_METRO_CONFIG_LOADED &&
  // TODO(huntie): Remove this check from 0.73 onwards (all users will be on
  // the next major @react-native/metro-config version)
  !/['"']@react-native\/metro-config['"']/.test(_fs().default.readFileSync(projectConfig.filepath, 'utf8'))) {
    _cliTools().logger.warn('From React Native 0.72, your metro.config.js file should extend' + "'@react-native/metro-config'. Please see the React Native 0.72 " + 'changelog, or copy the template at:\n' + 'https://github.com/facebook/react-native/blob/main/packages/react-native/template/metro.config.js');
    _cliTools().logger.warn('Falling back to internal defaults.');
    const loadedConfig = await (0, _metroConfig().loadConfig)({
      cwd: ctx.root,
      ...options
    },
    // Provide React Native defaults on top of Metro defaults
    (0, _getDefaultMetroConfig.default)(ctx));
    return (0, _metroConfig().mergeConfig)(loadedConfig, overrideConfig);
  }
  return (0, _metroConfig().mergeConfig)(await (0, _metroConfig().loadConfig)({
    cwd,
    ...options
  }), overrideConfig);
}

//# sourceMappingURL=loadMetroConfig.ts.map