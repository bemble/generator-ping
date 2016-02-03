var helpers = require('yeoman-test');
var assert = require('yeoman-assert');
var path = require('path');
var fs = require('fs');

describe('app', () => {
  beforeEach((done) => {
    this.generator = helpers.run(path.join(__dirname, '../generators/app'));
    this.generator.withOptions({ skipInstall: true });
    this.generator.inTmpDir((dir) => {
      fs.writeFileSync(dir + '/package.json', '{\n"name": "foo-bar"\n}');
    });
    this.generator.on('end', done);
  });

  it('generates them in the right place', () => {
    assert.file([
      'bower.json',
      'server.js',
      'src/app.ts',
      'src/index.jade',
      'src/main.ts',
      'src/style.less',
      'src/templates.debug.ts',
      'test/karma/app.spec.ts',
      'test/protractor/app.spec.ts'
    ]);
  });

  it('repalces the name of the appliction in the templates', () => {
    assert.fileContent('bower.json', /"name": "foo-bar"/);
    assert.fileContent('src/app.ts', /angular\.module\('foo-bar', \['foo-barTemplates', /);
    assert.fileContent('src/index.jade', /h1 foo-bar/);
    assert.fileContent('src/main.ts', /angular\.bootstrap\(document, \['foo-bar'\]\);/);
    assert.fileContent('src/templates.debug.ts', /angular\.module\('foo-barTemplates', \[\]\);/);
    assert.fileContent('test/karma/app.spec.ts', /app named "foo-bar"'/);
    assert.fileContent('test/karma/app.spec.ts', /expect\(\(\) => { angular\.module\('foo-bar'\);/);
    assert.fileContent('test/protractor/app.spec.ts', /describe\('application: foo-bar'/);
    assert.fileContent('test/protractor/app.spec.ts', /h1 that contains "foo-bar"',/);
    assert.fileContent('test/protractor/app.spec.ts', /toEqual\('foo-bar'\);/);
  });
});