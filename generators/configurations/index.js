'use strict';
var generators = require('yeoman-generator');

module.exports = generators.Base.extend({
  constructor: function () {
    generators.Base.apply(this, arguments);
    this.conflicter.force = true;

    this.option('description', {
      type: String,
      required: true,
      desc: 'Project description'
    });
  },

  writing: function () {
    var currentPkg = this.fs.readJSON(this.destinationPath('package.json'), {});
    currentPkg.scripts = {
      "test": "gulp build:test"
    };
    currentPkg.main = "server.js";
    currentPkg.description = this.options.description;

    this.fs.writeJSON(this.destinationPath('package.json'), currentPkg);

    this.template('**/*', './', {name: currentPkg.name}, {delimiter: "?"});
    this.copy(this.templatePath('.gitignore'), this.destinationPath('.gitignore'));
  }
});