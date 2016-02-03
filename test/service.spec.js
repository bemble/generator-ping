var helpers = require('yeoman-test');
var assert = require('yeoman-assert');
var path = require('path');

describe('service', () => {
  beforeEach(() => {
    this.generator = helpers.run(path.join(__dirname, '../generators/service'));
  });

  describe('templates', () => {
    beforeEach((done) => {
      this.generator.withOptions({appName: 'foo-bar', name: 'foô bàr-lol_éxp'});
      this.generator.on('end', done);
    });

    it('generates them in the right place with the right name', () => {
      assert.file([
        'src/services/FooBarLolExp.ts',
        'test/karma/services/FooBarLolExp.spec.ts'
      ]);
    });

    it('generates the typescript source with the right class, service and application names', () => {
      var sourceFile = 'src/services/FooBarLolExp.ts';
      assert.fileContent(sourceFile, /export class FooBarLolExp/);
      assert.fileContent(sourceFile, /angular.module\('foo-bar'\);/);
      assert.fileContent(sourceFile, /app.service\('fooBarLolExpService', Services.FooBarLolExp\);/);
    });

    it('generates the test typescript source with the right class, service and application names', () => {
      var testfile = 'test/karma/services/FooBarLolExp.spec.ts';
      assert.fileContent(testfile, /reference path="..\/..\/..\/src\/services\/FooBarLolExp.ts"/);
      assert.fileContent(testfile, /describe\('Service: FooBarLolExp',/);
      assert.fileContent(testfile, /var service:Services.FooBarLolExp;/);
      assert.fileContent(testfile, /angular.mock.module\('foo-bar'\)/);
      assert.fileContent(testfile, /service = <Services.FooBarLolExp> \$injector.get\('fooBarLolExpService'\);/);
    });
  });
});