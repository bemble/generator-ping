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
      desc: 'Component name'
    });

    this.option('prefix', {
      type: String,
      required: true,
      desc: 'Component tag prefix'
    });
  },

  initializing: function () {
    this.pkg = this.fs.readJSON(this.destinationPath('package.json'), {});

    this.props = {
      appName: this.pkg.name,
      name: this.options.name,
      nameCamel: null,
      prefix: this.options.prefix !== undefined ? this.options.prefix : 'pg',
      directiveElementName: null
    };
  },

  prompting: function () {
    var nameCallback = (done) => {
      this.props.name = S(this.props.name).latinise().camelize().s;
      this.props.name = this.props.name[0].toUpperCase() + this.props.name.substr(1);
      this.props.nameCamel = this.props.name[0].toLowerCase() + this.props.name.substr(1);
      this.props.directiveElementName = S(this.props.nameCamel).dasherize();

      let questions = [];
      if(!this.options.prefix) {
        questions.push({
          type: 'input',
          name: 'prefix',
          message: 'HTML tag prefix:',
          default: this.props.prefix
        });
      }

      if(questions.length) {
        this.prompt(questions, (answers) => {
          this.props.prefix = (answers.prefix || '').toLowerCase();
          done();
        });
      }
      else {
        done();
      }
    };

    if (!this.props.name) {
      var done = this.async();
      this.prompt({
        type: 'input',
        name: 'name',
        message: 'Component name:'
      }, (answers) => {
        this.props.name = answers.name;
        nameCallback(done);
      });
    }
    else {
      var done = this.async();
      nameCallback(done);
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