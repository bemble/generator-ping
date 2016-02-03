var helpers = require('yeoman-test');
var assert = require('yeoman-assert');
var path = require('path');

describe('readme', () => {
  beforeEach(() => {
    this.generator = helpers.run(path.join(__dirname, '../generators/readme'));
  });

  describe('templates', () => {
    beforeEach((done) => {
      this.generator.withOptions({name: 'foo-bar', description: 'foo description'});
      this.generator.on('end', done);
    });

    it('generates them in the right place', () => {
      assert.file('README.md');
    });

    it('generates the README.md with the name and description set in option', () => {
      var sourceFile = 'README.md';
      assert.fileContent(sourceFile, /^# foo-bar$/m);
      assert.fileContent(sourceFile, /^foo description$/m);
    });
  });
});