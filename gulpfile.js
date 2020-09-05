'use strict';

const { src, dest, watch, series, parallel } = require('gulp'),
  sass = require('gulp-sass'),
  scsslint = require('gulp-scss-lint'),
  autoprefix = require('gulp-autoprefixer'),
  compress = require('gulp-clean-css'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify-es').default,
  rev = require('gulp-rev'),
  del = require('delete');
const gulpCleanCss = require('gulp-clean-css');

/**
 * Delete files declared in the glob.
 */
function clean() {
  return del(['./web/css', './web/js', './web/manifest.json']);
}

function styles() {
  return src(['./lib/scss/main.scss'])
    .pipe(scsslint())
    .pipe(sass().on('error', sass.logError))
    .pipe(dest('./web/css'));
}

function scripts() {
  return src(['./node_modules/@highlightjs/cdn-assets/highlight.js', './node_modules/@highlightjs/cdn-assets/languages/dart.min.js', './lib/js/main.js'])
    .pipe(uglify())
    .pipe(concat('main.js'))
    .pipe(dest('./web/js'));
}

/**
 * Static asset revisioning by appending content hash to filenames.
 * NOTE: Make sure to set the files to never expire for this to have an effect.
 */
function revision() {
  return src(['./web/css/main.css'], {base: './web/'})
    .pipe(rev())
    .pipe(dest('./web'))
    .pipe(rev.manifest('manifest.json', {merge: true}))
    .pipe(dest('./web'));
}

/**
 * Run '$ gulp --tasks' for a complete lists of Gulp tasks available.
 */
exports.clean = clean;
exports.watch = function() {
  watch(['./lib/scss/**/*.scss', './lib/js/**/*.js'], series(clean, styles, scripts, revision));
}
exports.default = series(clean, styles, scripts, revision);