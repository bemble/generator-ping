'use strict';

/**********************************************
 * Dependencies
 *********************************************/
var gulp = require('gulp');
var spawn = require('child_process').spawn;
var tsconfig = require("gulp-tsconfig-files");
var changed = require('gulp-changed');
var ts = require('gulp-typescript');
var less = require('gulp-less');
var autoprefixer = require('gulp-autoprefixer');
var ngAnnotate = require('gulp-ng-annotate');
var sourcemaps = require('gulp-sourcemaps');
var livereload = require('gulp-livereload');
var protractor = require('gulp-protractor').protractor;
var KarmaServer = require('karma').Server;
var mergeStream = require('merge-stream');
var del = require('del');


/**********************************************
 * Tasks registration
 *********************************************/
gulp.task('clean', cleanTask);
gulp.task('server', serverTask);
gulp.task('reloadJade', reloadJadeTask);
gulp.task('tsconfigGlob', tsconfigGlobTask);
gulp.task('typescript', ['tsconfigGlob'], typescriptTask);
gulp.task('typescript:force', ['tsconfigGlob'], typescriptForceTask);
gulp.task('less', lessTask);
gulp.task('less:force', lessForceTask);
gulp.task('protractor', ['typescript:force', 'less:force'], protractorTask);
gulp.task('default', ['typescript:force', 'less:force', 'server'], () => {
  livereload.listen({quiet: true});

  gulp.watch(['./server.js', './config.js'], ['server']);
  gulp.watch(['src/**/*.ts', 'test/**/*.ts'], ['typescript']);
  gulp.watch(['src/**/*.jade'], ['reloadJade']);
  gulp.watch('src/**/*.less', ['less']);

  // Start unit tests
  new KarmaServer({
    configFile: __dirname + '/../test/karma.conf.js',
    singleRun: false,
    autoWatch: true
  }).start();
});

/**********************************************
 * Tasks
 *********************************************/
var node = null;
serverTask.description = 'Start local development webserver';
function serverTask() {
  if (node) {
    console.log('Restarting the server...');
    node.kill();
  }
  node = spawn('node', ['server.js'], {stdio: 'inherit'});
  node.on('close', function (code) {
    if (code === 8) {
      gulp.log('Error detected, waiting for changes...');
    }
  });
}
process.on('exit', () => {
  if (node) {
    console.log('Stoping the server...');
    node.kill();
  }
});

reloadJadeTask.description = "Reload the page if a template changed";
function reloadJadeTask(done) {
  gulp.src('src/**/*.jade', {read: false})
    .pipe(changed('.'))
    .pipe(livereload());
  done();
}

tsconfigGlobTask.description = "Generate files section of tsconfig.json";
function tsconfigGlobTask() {
  let tsProject = ts.createProject('tsconfig.json');
  return gulp.src(tsProject.config.filesGlob)
    .pipe(tsconfig({posix: true}));
}


function typescriptPrivateTask(force) {
  var tsProject = ts.createProject('tsconfig.json');
  var stream = tsProject.src()
    .pipe(sourcemaps.init());

  if (!force) {
    stream = stream.pipe(changed('.', {extension: '.js'}))
  }
  return stream.pipe(ts(tsProject)).js
    .pipe(ngAnnotate())
    .pipe(sourcemaps.write({sourceRoot: ''}))
    .pipe(gulp.dest('./'))
    .pipe(livereload());
}

typescriptTask.description = "Transpile modified app and karma tests Typescript files";
function typescriptTask() {
  return typescriptPrivateTask();
}

typescriptForceTask.description = "Transpile all Typescript files";
function typescriptForceTask() {
  var tsStream = typescriptPrivateTask(true);

  var tsProject = ts.createProject('tsconfig.json');
  var tsProtractorStream = gulp.src(['./test/protractor/**/*.ts'], {base: './'})
    .pipe(sourcemaps.init())
    .pipe(ts(tsProject))
    .pipe(sourcemaps.write({sourceRoot: ''}))
    .pipe(gulp.dest('./'));

  return mergeStream(tsStream, tsProtractorStream);
}


function lessPrivateTask(force) {
  var stream = gulp.src('src/**/*.less')
    .pipe(sourcemaps.init());
  if (!force) {
    stream = stream.pipe(changed('.', {extension: '.css'}));
  }
  return stream.pipe(less())
    .pipe(autoprefixer({ browsers: ['last 2 versions'] }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./src'))
    .pipe(livereload());
}

lessTask.description = "Transpile modified Less files";
function lessTask() {
  return lessPrivateTask();
}

lessForceTask.description = "Transpile all Less files";
function lessForceTask() {
  return lessPrivateTask(true);
}

protractorTask.description = "Run protractor tests";
function protractorTask() {
  return gulp.src([])
    .pipe(protractor({
      configFile: "test/protractor.conf.js"
    }));
}

function cleanTask() {
  return del(['src/**/*.js', 'src/**/*.css', 'src/**/*.html', 'test/**/*.js', 'test/**/*.html', '!test/**/*.conf.js']);
}