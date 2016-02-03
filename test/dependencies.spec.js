var helpers = require('yeoman-test');
var assert = require('yeoman-assert');
var path = require('path');

describe('dependencies', () => {
  beforeEach(() => {
    this.generator = helpers.run(path.join(__dirname, '../generators/dependencies'));
  });

  describe('templates', () => {
    beforeEach((done) => {
      this.generator.withOptions({name: 'foo-bar', description: 'foo description'});
      this.generator.on('ready', (gen) => { gen.bowerInstall = gen.npmInstall = () => {}; gen.skipTypings = true;});
      this.generator.on('end', done);
    });

    it('generates them in the right place', () => {
      assert.file('typings/dev.d.ts');
      assert.file('typings/karma.d.ts');
      assert.file('typings/protractor.d.ts');
    });
  });
});