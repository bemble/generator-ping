'use strict';

/**********************************************
 * Dependencies
 *********************************************/
var gulp = require('gulp');
var runSequence = require('run-sequence');
var gutil = require('gulp-util');
var del = require('del');
var jade = require('gulp-jade');
var fs = require('fs');
var KarmaServer = require('karma').Server;
var templateCache = require('gulp-angular-templatecache');
var replace = require('gulp-replace');
var flatten = require('gulp-flatten');

var buildDir = require('../config').buildDir;
// /!\ Only these fonts format will be kept, be sure every font have theses formats
var keptFontFormats = ['woff', 'woff2']; // ['embedded-opentype', 'woff', 'woff2', 'truetype', 'svg']

/**********************************************
 * Tasks registration
 *********************************************/
gulp.task('build:clean', cleanTask);
gulp.task('build:copy', copyTask);
gulp.task('build:test', ['typescript:force', 'less:force'], testTask);
gulp.task('build:template-cache', templateCacheTask);
gulp.task('build:templates', ['typescript:force', 'less:force', 'build:template-cache'], templatesTask);
gulp.task('build:bundles', ['typescript:force', 'less:force'], bundlesTask);
gulp.task('build', buildTask);


/**********************************************
 * Tasks
 *********************************************/
cleanTask.description = `Clean build output directory ("${buildDir}")`;
function cleanTask() {
  return del([buildDir, './src/templates.js']);
}

copyTask.description = '';
function copyTask() {
  var fontFormatExtensions = {
    woff: 'woff',
    woff2: 'woff2',
    'embedded-opentype': 'eot',
    truetype: 'ttf',
    svg: 'svg'
  };
  var keptExts = Object.keys(fontFormatExtensions).filter((format) => keptFontFormats.indexOf(format) >= 0).map((format) => fontFormatExtensions[format]);

  return gulp.src(keptExts.map((ext) => './bower_components/**/*.' + ext))
    .pipe(flatten())
    .pipe(gulp.dest(buildDir + '/assets'));
}

testTask.description = "Run tests";
function testTask(done) {
  var server = new KarmaServer({
    configFile: __dirname + '/../test/karma.conf.js',
    singleRun: true
  }, () => {
  });
  server.on('run_complete', (browsers, results) => {
    if (results.error) {
      let msg = results.failed > 1 ? ' tests failed' : ' test failed';
      done(new gutil.PluginError('build:test', results.failed + msg, {showStack: false}));
      return;
    }
    // Protractor tests will not be run to prevent any build fail on any system without expected web browser
    // Also, protractor is configured to require the current website to be served
    done();
  });
  server.start();
}

templatesTask.description = "Transpile templates";
function templatesTask() {
  let config = require('../config');
  require('bdlr').ENV = 'production';

  return gulp.src('./src/index.jade')
    .pipe(jade({
      locals: {bundles: config.bundles}
    }))
    .pipe(gulp.dest(buildDir))
}

bundlesTask.description = "Create the configured bundles";
function bundlesTask() {
  let config = require('../config');

  Object.keys(config.bundles).forEach((bundleName) => {
    var bundle = config.bundles[bundleName];
    fs.writeFileSync(buildDir + bundle.url, bundle.getMinifiedContent());
  });

  del('./src/templates.js');

  return gulp.src([buildDir + '/**/*.css'])
    .pipe(replace(new RegExp('bower_components/font-awesome/fonts/', 'g'), 'assets/'))
    // Don't keep all the fonts
    .pipe(replace(new RegExp('(@font-face{[^}]*})', 'g'), (_, fontFace) => {
      var sources = fontFace.match(/(src:[^;]+;)/g);
      // Special case for embedded-opentype
      if (keptFontFormats.indexOf('embedded-opentype') < 0 && sources.length > 1) {
        fontFace = fontFace.replace(sources[0], '');
      }
      var keptSources = sources[1].match(new RegExp('url\\([^\\)]+\\)\\s+format\\(["\'](' + keptFontFormats.join('|') + ')["\']\\)', 'g'));
      if(keptSources) {
        fontFace = fontFace.replace(sources[1], 'src:' + keptSources.join(',') + ';');
      }
      return fontFace;
    }))
    .pipe(gulp.dest(buildDir));
}

templateCacheTask.description = "Build angular template cache";
function templateCacheTask() {
  var TEMPLATE_HEADER = '(function() {\n\t"use strict";\n\tangular.module("<%= module %>"<%= standalone %>).run(["$templateCache", function($templateCache) {\n';
  var TEMPLATE_BODY = '\t\t$templateCache.put("<%= url %>","<%= contents %>");';
  var TEMPLATE_FOOTER = '\n\t}]);\n})();';
  return gulp.src(['./src/**/*.jade', '!./src/index.jade'])
    .pipe(jade())
    .pipe(templateCache({
      module: '<?= name ?>Templates',
      standalone: true,
      templateHeader: TEMPLATE_HEADER,
      templateBody: TEMPLATE_BODY,
      templateFooter: TEMPLATE_FOOTER
    }))
    .pipe(gulp.dest('./src'));
}

buildTask.description = `Build the application into "${buildDir}"`;
function buildTask(done) {
  runSequence(
    'build:clean', 'build:test', 'build:templates', 'build:bundles', 'build:copy',
    (error) => {
      if (error) {
        done(new gutil.PluginError('build', error.message, {showStack: false}));
        process.exit(1);
      }
      done();
      process.exit(0);
    }
  );
}