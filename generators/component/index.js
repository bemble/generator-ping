'use strict';
var generators = require('yeoman-generator');
var fs = require('fs');
var S = require('string');

module.exports = generators.Base.extend({
  constructor: function () {
    generators.Base.apply(this, arguments);

    this.option('appName', {
      type: String,
      required: true,
      desc: 'Application name',
      default: S(this.determineAppname()).dasherize.s
    });

    this.option('name', {
      type: String,
      required: true,
      desc: 'Component name'
    });

    this.option('prefix', {
      type: String,
      required: true,
      desc: 'Component HTML tag prefix',
      default: 'pg'
    });
  },

  initializing: function () {
    this.props = {
      appName: this.options.appName,
      name: this.options.name,
      nameCamel: null,
      prefix: this.options.prefix ? this.options.prefix : '',
      directiveElementName: null
    };
  },

  prompting: function () {
    var nameCallback = () => {
      this.props.name = S(this.props.name).latinise().camelize().s;
      this.props.name = this.props.name[0].toUpperCase() + this.props.name.substr(1);
      this.props.nameCamel = this.props.name[0].toLowerCase() + this.props.name.substr(1);
      this.props.directiveElementName = S(this.props.nameCamel).dasherize();
    };

    let questions = [];

    if (!this.props.appName) {
      questions.push({
        type: 'input',
        name: 'appName',
        message: 'Application name:'
      });
    }
    if (!this.props.prefix) {
      questions.push({
        type: 'input',
        name: 'prefix',
        message: 'Component HTML tag prefix:',
        default: this.props.prefix || null
      });
    }
    if (!this.props.name) {
      questions.push({
        type: 'input',
        name: 'name',
        message: 'Component name:'
      });
    }

    if (questions.length) {
      var done = this.async();
      this.prompt(questions, (answers) => {
        this.props.name = this.props.name || answers.name;
        this.props.appName = this.props.appName || answers.appName;
        this.props.prefix = (this.props.prefix || answers.prefix || '').toLowerCase();
        nameCallback();
        done();
      });
    }
    else {
      nameCallback();
    }
  },

  writing: function () {
    let outFile = './src/components/' + this.props.name + '/' + this.props.name + '.';
    ['jade', 'ts'].forEach((ext) => {
      this.template('component.' + ext, outFile + ext, this.props);
    });
    this.template('protractor.spec.ts', './test/protractor/components/' + this.props.name + '/' + this.props.name + '.spec.ts', this.props);
  }
});