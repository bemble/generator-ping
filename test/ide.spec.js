var helpers = require('yeoman-test');
var assert = require('yeoman-assert');
var path = require('path');
var fs = require('fs');

describe('ide', () => {
  beforeEach(() => {
    this.generator = helpers.run(path.join(__dirname, '../generators/ide'));
  });

  describe('VisualStudio Code', () => {
    beforeEach((done) => {
      this.generator.withPrompts({ide: 'VisualStudio Code'});
      this.generator.on('end', done);
    });

    it('generates templates in the right place', () => {
      assert.file([
        '.vscode/jsconfig.json',
        '.vscode/settings.json',
        '.vscode/tasks.json'
      ]);
    });
  });

  describe('WebStorm', () => {
    beforeEach((done) => {
      this.generator.withPrompts({ide: 'WebStorm'});
      this.generator.inTmpDir((dir) => {
        fs.writeFileSync(dir + '/package.json', '{\n"name": "foo-bar"\n}');
      });
      this.generator.on('end', done);
    });

    it('generates templates in the right place', () => {
      assert.file([
        '.idea/.name',
        '.idea/encodings.xml',
        '.idea/jsLibraryMappings.xml',
        '.idea/modules.xml',
        '.idea/test.iml',
        '.idea/workspace.xml',
        '.idea/inspectionProfiles/profiles_settings.xml',
        '.idea/inspectionProfiles/Project_Default.xml',
        '.idea/libraries/test_node_modules.xml'
      ]);
    });

    it('generates the .name with the name set in option', () => {
      assert.fileContent('.idea/.name', /^foo-bar$/);
    });
  });
});