'use strict';
var generators = require('yeoman-generator');
var fs = require('fs');
var S = require('string');

module.exports = generators.Base.extend({
  constructor: function () {
    generators.Base.apply(this, arguments);
    this.conflicter.force = true;

    this.option('name', {
      type: String,
      required: true,
      desc: 'Page name'
    });

    this.option('prefix', {
      type: String,
      required: true,
      desc: 'Page tag prefix'
    });

    this.option('link', {
      type: String,
      required: true,
      desc: 'Page link'
    });
  },

  initializing: function () {
    this.pkg = this.fs.readJSON(this.destinationPath('package.json'), {});

    this.props = {
      appName: this.pkg.name,
      name: this.options.name,
      nameCamel: null,
      link: this.options.link,
      prefix: this.options.prefix !== undefined ? this.options.prefix : 'pg',
      directiveElementName: null
    };
  },

  prompting: function () {
    var nameCallback = (done) => {
      this.props.name = S(this.props.name).latinise().camelize().s;
      this.props.name = 'Page' + this.props.name[0].toUpperCase() + this.props.name.substr(1);
      this.props.nameCamel = this.props.name[0].toLowerCase() + this.props.name.substr(1);

      let questions = [];
      if (!this.options.prefix) {
        questions.push({
          type: 'input',
          name: 'prefix',
          message: 'HTML tag prefix:',
          default: this.props.prefix
        });
      }

      if (!this.props.link) {
        questions.push({
          type: 'input',
          name: 'link',
          message: 'Page link:',
          default: () => '/' + S(this.props.nameCamel).dasherize().s.slice(5)
        });
      }

      var questionCallback = (answers) => {
        if (answers) {
          this.props.link = this.props.link || answers.link;
          this.props.prefix = (this.props.prefix || answers.prefix).toLowerCase();
        }
        this.props.directiveElementName = (this.props.prefix ? this.props.prefix + '-' : '') + S(this.props.nameCamel).dasherize();
        done();
      };

      if (questions.length) {
        this.prompt(questions, questionCallback);
      }
      else {
        questionCallback();
      }
    };

    if (!this.props.name) {
      var done = this.async();
      this.prompt({
        type: 'input',
        name: 'name',
        message: 'Page name:'
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

  install: function () {
    this.composeWith('ping:component', {
      options: {
        name: this.props.name,
        prefix: this.props.prefix
      }
    });
  },

  writing: function () {
    var appTsFile = this.destinationRoot() + '/src/app.ts';
    var appTs = fs.readFileSync(appTsFile, 'utf-8');
    var regexp = /(\s*\.)(otherwise\(['"].*['"]\);)/;
    var route = 'when(\'' + this.props.link + '\', { template: \'<' + this.props.directiveElementName + ' />\' })';
    var newAppTs = appTs.replace(regexp, '$1' + route + '$1$2');
    this.fs.write(appTsFile, newAppTs);
  }
});