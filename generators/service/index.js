'use strict';
var generators = require('yeoman-generator');
var fs = require('fs');
var S = require('string');

module.exports = generators.Base.extend({
  constructor: function () {
    generators.Base.apply(this, arguments);

    this.option('name', {
      type: String,
      required: true,
      desc: 'Service name'
    });
  },

  initializing: function () {
    this.pkg = this.fs.readJSON(this.destinationPath('package.json'), {});

    this.props = {
      appName: this.pkg.name,
      name: this.options.name,
      nameCamel: null
    };
  },

  prompting: function () {
    var nameCallback = () => {
      this.props.name = S(this.props.name).latinise().camelize().s;
      this.props.name = this.props.name[0].toUpperCase() + this.props.name.substr(1);
      this.props.nameCamel = this.props.name[0].toLowerCase() + this.props.name.substr(1);
    };

    if (!this.props.name) {
      var done = this.async();
      this.prompt({
        type: 'input',
        name: 'name',
        message: 'Service name:'
      }, (answers) => {
        this.props.name = answers.name;
        nameCallback();
        done();
      });
    }
    else {
      nameCallback();
    }
  },

  writing: function () {
    let outFile = './src/services/' + this.props.name + '.';
    ['ts'].forEach((ext) => {
      this.template('service.' + ext, outFile + ext, this.props);
    });
    this.template('test.ts', './test/karma/services/' + this.props.name + '.ts', this.props);
  }
});