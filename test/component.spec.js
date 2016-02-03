var helpers = require('yeoman-test');
var assert = require('yeoman-assert');
var path = require('path');

describe('component', () => {
  beforeEach(() => {
    this.generator = helpers.run(path.join(__dirname, '../generators/component'));
  });

  describe('templates', () => {
    beforeEach((done) => {
      this.generator.withOptions({appName: 'foo-bar', prefix: 'foba', name: 'foô bàr-lol_éxp'});
      this.generator.on('end', done);
    });

    it('generates them in the right place with the right name', () => {
      assert.file([
        'src/components/FooBarLolExp/FooBarLolExp.ts',
        'src/components/FooBarLolExp/FooBarLolExp.jade',
        'test/protractor/components/FooBarLolExp/FooBarLolExp.spec.ts'
      ]);
    });

    it('generates the typescript source with the right class, directive and application names', () => {
      var sourceFile = 'src/components/FooBarLolExp/FooBarLolExp.ts';
      assert.fileContent(sourceFile, /export class FooBarLolExp/);
      assert.fileContent(sourceFile, /this.message = "Component: FooBarLolExp";/);
      assert.fileContent(sourceFile, /angular.module\('foo-bar'\);/);
      assert.fileContent(sourceFile, /app.directive\('fobaFooBarLolExp'/);
      assert.fileContent(sourceFile, /controller: ComponentControllers.FooBarLolExp,/);
      assert.fileContent(sourceFile, /controllerAs: 'fooBarLolExpCtrl'/);
    });

    it('generates protractor tests typescript source with the right class, directive and application names', () => {
      var sourceFile = 'test/protractor/components/FooBarLolExp/FooBarLolExp.spec.ts';
      assert.fileContent(sourceFile, /describe\('Component: FooBarLolExp'/);
      assert.fileContent(sourceFile, /browser.get\('\/test\.component\?component=foba-foo-bar-lol-exp'/);
      assert.fileContent(sourceFile, /by.binding\('fooBarLolExpCtrl.message'/);
      assert.fileContent(sourceFile, /toEqual\('Component: FooBarLolExp'\);/);
    });

    it('generates the view source with the right controller name', () => {
      var sourceFile = 'src/components/FooBarLolExp/FooBarLolExp.jade';
      assert.fileContent(sourceFile, /span\(ng-bind="fooBarLolExpCtrl.message"\)/);
    });
  });
});