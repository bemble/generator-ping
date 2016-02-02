'use strict';

// TODO: add some tests, please, even if it's painfull
// TODO: IDEs scaffolfing (vscode, webstorm)
module.exports = {
  app: require.resolve('./generators/app'),
  page: require.resolve('./generators/page'),
  component: require.resolve('./generators/component'),
  service: require.resolve('./generators/service')
};