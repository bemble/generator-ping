'use strict';

module.exports = {
  app: require.resolve('./generators/app'),
  ide: require.resolve('./generators/ide'),
  page: require.resolve('./generators/page'),
  component: require.resolve('./generators/component'),
  service: require.resolve('./generators/service')
};