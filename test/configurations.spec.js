var helpers = require('yeoman-test');
var assert = require('yeoman-assert');
var path = require('path');
var fs = require('fs');

describe('configurations', () => {
  beforeEach(() => {
    this.generator = helpers.run(path.join(__dirname, '../generators/configurations'));
  });

  describe('templates', () => {
    beforeEach((done) => {
      this.generator.withOptions({description: 'foo description'});
      this.generator.inTmpDir((dir) => {
        fs.writeFileSync(dir + '/package.json', '{\n"name": "foo-bar"\n}');
      });
      this.generator.on('end', done);
    });

    it('configures package.json', () => {
      assert.fileContent('package.json', /"test": "gulp build:test"/);
      assert.fileContent('package.json', /"main": "server.js"/);
      assert.fileContent('package.json', /"description": "foo description"/);
    });

    it('generates them in the right place', () => {
      assert.file([
        '.gitignore',
        'config.js',
        'gulpfile.js',
        'tsconfig.json',
        'gulpfile/buildTasks.js',
        'gulpfile/devTasks.js',
        'gulpfile/installTasks.js',
        'test/protractor/component.jade',
        'test/karma.conf.js',
        'test/protractor.conf.js'
      ]);
    });

    it('replaces the name of the application', () => {
      assert.fileContent('test/protractor/component.jade', /angular.module\('foo-bar'\).config\(\['\$routeProvider'/);
      assert.fileContent('gulpfile/buildTasks.js', /module: 'foo-barTemplates',/);
    });
  });
});