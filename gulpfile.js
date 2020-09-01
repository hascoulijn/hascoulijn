'use strict';

const { src, dest, watch, series, parallel } = require('gulp'),
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
  return del(['./lib/js/build', './web/css', './web/js', './web/manifest.json'])
}

/**
 * 1. Auto prefix stylesheet declaration block properties with vendor prefixes
 *    for multi-browser support.
 * 2. Compress stylesheets to reduce filesize.
 * 3. Bundle stylesheets from the library as one stylesheet to reduce HTTP
 *    requests on runtime.
 */
function styles() {
  return src(['./lib/js/highlight.js/vs.css', './lib/css/reset.css', './lib/css/root.css', './lib/css/text.css', './lib/css/app.css'])
    .pipe(autoprefix()) // 1
    .pipe(compress()) // 2
    .pipe(concat('screen.css')) // 3
    .pipe(dest('./web/css'))
}

// TODO: Find a way to reduce the amount of workarounds needed to uglify and
// concat JavaScript and try to bundle these tasks.

/**
 * Uglify (compress) JavaScript to reduce filesize.
 */
function scripts() {
  return src(['./lib/js/scripts.js'])
    .pipe(uglify())
    .pipe(dest('./lib/js/build'))
}

/**
 * Bundle local JavaScript files with external libraries to create one file too
 * reduce the amount of HTTP requests which reduces TTL.
 */
function bundle() {
  return src(['./lib/js/highlight.js/highlight.pack.js', './lib/js/build/scripts.js'])
  .pipe(concat('screen.js'))
  .pipe(dest('./web/js'))
}

/**
 * Static asset revisioning by appending content hash to filenames.
 * NOTE: Make sure to set the files to never expire for this to have an effect.
 */
function revision() {
  return src(['./web/css/screen.css', './web/js/screen.js'], {base: './web/'})
    .pipe(rev())
    .pipe(dest('./web'))
    .pipe(rev.manifest('manifest.json', {merge: true}))
    .pipe(dest('./web'))
}

/**
 * Run '$ gulp --tasks' for a complete lists of Gulp tasks available.
 */
exports.clean = clean;
exports.watch = function() {
  watch(['./lib/css/**/*.css'], series(clean, styles, scripts, bundle, revision));
}
exports.default = series(clean, styles, scripts, bundle, revision);