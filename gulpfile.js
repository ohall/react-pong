/**
 * Created by Oakley Hall on 6/16/15.
 */
'use strict';

var gulp = require('gulp');
var browserify = require('browserify');
var babelify = require('babelify');
var babel = require('gulp-babel');
var source = require('vinyl-source-stream');
var del = require('del');

gulp.task('build', ['clean', 'app', 'templates']);

gulp.task('clean', function (cb) {
  del([ 'dist/bundle.js'], cb);
});


gulp.task('templates', function () {
  return gulp.src('templates/*.*')
  .pipe(gulp.dest('dist'));
});

gulp.task('styles', function () {
  return gulp.src('src/styles/**/*.*')
  .pipe(gulp.dest('dist'));
});

gulp.task('lib', function () {
  return gulp.src('src/**/*.jsx')
    .pipe(babel())
    .pipe(gulp.dest('lib'));
});

gulp.task('app', function () {
  browserify({
    entries: 'src/index.jsx',
    extensions: ['.jsx'],
    debug: true
  })
  .transform(babelify)
  .bundle()
  .pipe(source('bundle.js'))
  .pipe(gulp.dest('dist'));
});

gulp.task('watch', ['build'], function() {
  gulp.watch('src/**/*.*', ['build']);
});

gulp.task('default', ['watch']);
