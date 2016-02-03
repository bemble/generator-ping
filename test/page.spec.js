var helpers = require('yeoman-test');
var assert = require('yeoman-assert');
var path = require('path');
var fs = require('fs');

describe('page', () => {
  beforeEach(() => {
    this.generator = helpers.run(path.join(__dirname, '../generators/page'));
  });

  describe('templates', () => {
    beforeEach((done) => {
      this.generator.withOptions({appName: 'foo-bar', prefix: 'foba', name: 'foô bàr-lol_éxp'});
      this.generator.on('end', done);
    });

    it('generates them in the right place with the right name', () => {
      assert.file([
        'src/components/PageFooBarLolExp/PageFooBarLolExp.ts',
        'src/components/PageFooBarLolExp/PageFooBarLolExp.jade',
        'test/protractor/components/PageFooBarLolExp/PageFooBarLolExp.spec.ts'
      ]);
    });

    it('generates the typescript source with the right class, directive and application names', () => {
      var sourceFile = 'src/components/PageFooBarLolExp/PageFooBarLolExp.ts';
      assert.fileContent(sourceFile, /export class PageFooBarLolExp/);
      assert.fileContent(sourceFile, /this.message = "Component: PageFooBarLolExp";/);
      assert.fileContent(sourceFile, /angular.module\('foo-bar'\);/);
      assert.fileContent(sourceFile, /app.directive\('fobaPageFooBarLolExp'/);
      assert.fileContent(sourceFile, /controller: ComponentControllers.PageFooBarLolExp,/);
      assert.fileContent(sourceFile, /controllerAs: 'pageFooBarLolExpCtrl'/);
    });

    it('generates protractor tests typescript source with the right class, directive and application names', () => {
      var sourceFile = 'test/protractor/components/PageFooBarLolExp/PageFooBarLolExp.spec.ts';
      assert.fileContent(sourceFile, /describe\('Component: PageFooBarLolExp'/);
      assert.fileContent(sourceFile, /browser.get\('\/test\.component\?component=foba-page-foo-bar-lol-exp'/);
      assert.fileContent(sourceFile, /by.binding\('pageFooBarLolExpCtrl.message'/);
      assert.fileContent(sourceFile, /toEqual\('Component: PageFooBarLolExp'\);/);
    });

    it('generates the view source with the right controller name', () => {
      var sourceFile = 'src/components/PageFooBarLolExp/PageFooBarLolExp.jade';
      assert.fileContent(sourceFile, /span\(ng-bind="pageFooBarLolExpCtrl.message"\)/);
    });
  });

  describe('add the route', () => {
    beforeEach(() => {
      this.generator.withOptions({appName: 'foo-bar', prefix: 'foba', name: 'foô bàr-lol_éxp'});
    });

    describe('in app.ts', () => {
      beforeEach((done) => {
        this.generator.inTmpDir((dir) => {
          fs.mkdirSync(dir + '/src');
          fs.writeFileSync(dir + '/src/app.ts', '.otherwise("/");');
        });
        this.generator.on('end', done);
      });

      it('generates the view source with the right controller name and template', () => {
        var sourceFile = 'src/app.ts';
        assert.fileContent(sourceFile, /\.when\('\/foo-bar-lol-exp', { template: '<foba-page-foo-bar-lol-exp \/>' }\)/);
      });
    });

    describe('in app.js', () => {
      beforeEach((done) => {
        this.generator.inTmpDir((dir) => {
          fs.mkdirSync(dir + '/src');
          fs.writeFileSync(dir + '/src/app.js', '.otherwise("/");');
        });
        this.generator.on('end', done);
      });

      it('generates the view source with the right controller name and template', () => {
        var sourceFile = 'src/app.js';
        assert.fileContent(sourceFile, /\.when\('\/foo-bar-lol-exp', { template: '<foba-page-foo-bar-lol-exp \/>' }\)/);
      });
    });
  });
});