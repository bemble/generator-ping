'use strict';

/**********************************************
 * Dependencies
 *********************************************/
var gulp = require('gulp');
var typings = require('typings');
var bower = require('gulp-bower');


/**********************************************
 * Tasks registration
 *********************************************/
gulp.task('install:typings', typingsTask);
gulp.task('install:bower', bowerTask);
gulp.task('install:selenium', seleniumTask);
gulp.task('install', ['install:tsd', 'install:bower', 'install:selenium']);


/**********************************************
 * Tasks
 *********************************************/
typingsTask.description = 'Install typescript declaration files';
function typingsTask(done) {
  typings.install({cwd: __dirname + '/typings/'}).then(() => {
    done();
  });
}

bowerTask.description = 'Install bower dependencies';
function bowerTask() {
  return bower();
}

seleniumTask.description = 'Install selenium dependencies';
function seleniumTask(done) {
  return require("gulp-protractor").webdriver_update(done);
}