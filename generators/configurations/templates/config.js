var bdlr = require('bdlr');

bdlr.createBundle('style', bdlr.STYLE, 'style.bundle.css')
  .includeBowerComponents(['angular-mocks'])
  .includeFile('bower_components/font-awesome/css/font-awesome.css')
  .includeGlob('src/**/*.css');

bdlr.createBundle('lib', bdlr.SCRIPT, 'lib.bundle.js')
  .includeBowerComponents(['angular-mocks']);

bdlr.createBundle('app', bdlr.SCRIPT, 'app.bundle.js')
  .includeFile('src/templates.js')
  .includeFile('src/app.js')
  .includeGlob('src/**/*.js')
  .includeFile('src/main.js');

module.exports = {
  buildDir: './dist/',
  app: {
    port: 9000
  },
  liveReload: {
    port: 35729
  },
  bundles: bdlr.bundles
};