'use strict';
var generators = require('yeoman-generator');

module.exports = generators.Base.extend({
  constructor: function () {
    generators.Base.apply(this, arguments);
    this.conflicter.force = true;
  },

  writing: function () {
    this.template('**/*', './');
  },

  installing: function () {
    this.npmInstall(['bdlr', 'express'], {'save': true});
    this.npmInstall([
      'del', 'gulp', 'gulp-autoprefixer', 'gulp-bower', 'gulp-changed', 'gulp-exec', 'gulp-jade', 'gulp-livereload', 'gulp-angular-templatecache',
      'gulp-ng-annotate', 'gulp-protractor', 'gulp-less', 'gulp-sourcemaps', 'gulp-tsconfig-files', 'gulp-typescript', 'gulp-util', 'jade',
      'gulp-flatten', 'gulp-replace', 'karma', 'karma-jasmine', 'karma-jasmine-feature', 'karma-phantomjs-launcher', 'karma-sourcemap-loader',
      'main-bower-files', 'merge-stream', 'phantomjs-prebuilt', 'run-sequence', 'typings'
    ], {'saveDev': true}, () => {
      var webdriverManagerBin = process.cwd() + '/node_modules/protractor/bin/webdriver-manager';
      this.spawnCommand(webdriverManagerBin, ['update']);
    });

    this.bowerInstall(['angular', 'angular-material', 'angular-route', 'font-awesome'], {'save': true});
    this.bowerInstall(['angular-mocks'], {'saveDev': true});

    // Typings: /!\ relies on undocumented API -> https://github.com/typings/typings/issues/143
    class TypingDependency {
      constructor(name, notAmbient, source) {
        this.name = name;
        this.ambient = !notAmbient;
        this.source = source ? source : 'dt';
      }
    }
    var typingsToInstall = [
      new TypingDependency('jquery'),
      new TypingDependency('angular'),
      new TypingDependency('angular-material'),
      new TypingDependency('angular-mocks'),
      new TypingDependency('angular-route'),
      new TypingDependency('selenium-webdriver'),
      new TypingDependency('angular-protractor'),
      new TypingDependency('jasmine')
    ];
    var typings = require('typings');
    var cwd = this.destinationPath();
    // Init the "typings.json" file
    typings.init({cwd: cwd}).then(() => {
      var typingCwd = cwd + '/typings/';
      var registry = require('typings/dist/lib/registry');
      typingsToInstall.forEach((typing) => {
        var version = registry.parseRegistryPath(typing.name).version;
        // Get information about version etc
        registry.getVersions(typing.source, typing.name, version).then((project) => {
          version = project.versions[0];
          // Finally can install the dependency
          typings.installDependency(version.location, {
            name: typing.name,
            cwd: typingCwd,
            saveDev: true,
            source: typing.source,
            ambient: typing.ambient
          }).then(() => {
            this.log.ok('typings for ' + typing.name + ' installed');
          });
        });
      });
    });
  },

  end: function () {

  }
});