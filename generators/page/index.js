'use strict';
var generators = require('yeoman-generator');
var fs = require('fs');
var S = require('string');

module.exports = generators.Base.extend({
  constructor: function () {
    generators.Base.apply(this, arguments);
    this.conflicter.force = true;

    this.option('appName', {
      type: String,
      required: true,
      desc: 'Application name',
      default: S(this.determineAppname()).dasherize.s
    });

    this.option('name', {
      type: String,
      required: true,
      desc: 'Page name'
    });

    this.option('prefix', {
      type: String,
      required: true,
      desc: 'Page tag prefix',
      default: 'pg'
    });

    this.option('link', {
      type: String,
      required: true,
      desc: 'Page link'
    });
  },

  initializing: function () {
    this.props = {
      appName: this.options.appName,
      name: this.options.name,
      nameCamel: null,
      link: this.options.link,
      prefix: this.options.prefix,
      directiveElementName: null
    };
  },

  prompting: function () {
    var nameCallback = (done) => {
      this.props.name = S(this.props.name).latinise().camelize().s;
      this.props.name = 'Page' + this.props.name[0].toUpperCase() + this.props.name.substr(1);
      this.props.nameCamel = this.props.name[0].toLowerCase() + this.props.name.substr(1);

      var computeDirectiveName = (answers) => {
        this.props.link = this.props.link || answers.link;
        this.props.directiveElementName = (this.props.prefix ? this.props.prefix + '-' : '') + S(this.props.nameCamel).dasherize();
        done();
      };

      if (!this.props.link) {
        this.prompt({
          type: 'input',
          name: 'link',
          message: 'Page link:',
          default: () => '/' + S(this.props.nameCamel).dasherize().s.slice(5)
        }, computeDirectiveName);
      }
      else {
        computeDirectiveName();
      }
    };

    let questions = [];
    if (!this.props.appName) {
      questions.push({
        type: 'input',
        name: 'appName',
        message: 'Application name:'
      });
    }
    if (!this.props.name) {
      questions.push({
        type: 'input',
        name: 'name',
        message: 'Page name:'
      });
    }
    if (!this.props.prefix) {
      questions.push({
        type: 'input',
        name: 'prefix',
        message: 'Page HTML tag prefix:',
        default: this.props.prefix || null
      });
    }

    if (questions.length) {
      var done = this.async();
      this.prompt(questions, (answers) => {
        this.props.appName = this.props.appName || answers.appName;
        this.props.name = this.props.name || answers.name;
        this.props.link = this.props.link || answers.link;
        this.props.prefix = (this.props.prefix || answers.prefix || '').toLowerCase();
        nameCallback(done);
      });
    }
    else {
      var done = this.async();
      nameCallback(done);
    }
  },

  createComponent: function () {
    this.composeWith('ping:component', {
      options: {
        appName: this.props.appName,
        name: this.props.name,
        prefix: this.props.prefix
      }
    }, {
      local: require.resolve('../component')
    });
  },

  writing: function () {
    var appFile = this.destinationRoot() + '/src/app.';
    var ext = ['ts', 'js'].find((ext) => {
      try {
        var file = appFile + ext;
        fs.accessSync(file);
        return true;
      } catch(_) {}
      return false;
    });
    if(ext) {
      appFile += ext;
      var appTs = fs.readFileSync(appFile, 'utf-8');
      var regexp = /(\s*\.)(otherwise\(['"].*['"]\);)/;
      var route = 'when(\'' + this.props.link + '\', { template: \'<' + this.props.directiveElementName + ' />\' })';
      var newApp = appTs.replace(regexp, '$1' + route + '$1$2');
      this.fs.write(appFile, newApp);
    }
    else {
      this.log.info('no application file found');
    }
  }
});