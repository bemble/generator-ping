'use strict';
var generators = require('yeoman-generator');
var S = require('string');

module.exports = generators.Base.extend({
  constructor: function () {
    generators.Base.apply(this, arguments);
    this.conflicter.force = true;

    this.ideFolderMapping = {
      'WebStorm': '.idea',
      'VisualStudio Code': '.vscode'
    };
  },

  prompting: function () {
    var done = this.async();
    this.prompt({
      type: 'list',
      name: 'ide',
      message: 'IDE to configure:',
      choices: ['none'].concat(Object.keys(this.ideFolderMapping))
    }, function (answers) {
      this.ideName = answers.ide === 'none' ? null : answers.ide;
      this.ide = this.ideName ? this.ideName.replace(' ', '').toLowerCase() : null;
      done();
    }.bind(this));
  },

  writing: function () {
    if (this.ide) {
      this.template(this.ide + '/**/*', this.ideFolderMapping[this.ideName]);
      if(this.ide === 'webstorm') {
        this.template(this.ide + '/.name', this.ideFolderMapping[this.ideName] + '/.name', {name: S(this.determineAppname()).dasherize().s});
      }
    }
  }
});