'use strict';

const { src, dest, watch, series, parallel } = require('gulp'),
  autoprefix = require('gulp-autoprefixer'),
  compress = require('gulp-clean-css'),
  concat = require('gulp-concat'),
  rev = require('gulp-rev'),
  del = require('delete');

/**
 * Delete files declared in the glob.
 */
function clean() {
  return del(['./web/css', './web/js', './web/manifest.json'])
}

/**
 * 1. Auto prefix stylesheet declaration block properties with vendor prefixes
 *    for multi-browser support.
 * 2. Compress stylesheets to reduce filesize.
 * 3. Bundle stylesheets from the library as one stylesheet to reduce HTTP
 *    requests on runtime.
 * 4. Write build file in destinated glob.
 */
function styles() {
  return src(['./lib/css/reset.css', './lib/css/screen.css'])
    .pipe(autoprefix()) // 1
    .pipe(compress()) // 2
    .pipe(concat('screen.css')) // 3
    .pipe(dest('./web/css')) // 4
}

/**
 * Static asset revisioning by appending content hash to filenames.
 * NOTE: Make sure to set the files to never expire for this to have an effect.
 */
function revision() {
  return src(['./web/css/screen.css'], {base: './web/'})
    .pipe(rev())
    .pipe(dest('./web'))
    .pipe(rev.manifest('manifest.json', {merge: true}))
    .pipe(dest('./web'))
}

/**
 * Run '$ gulp --tasks' for a complete lists of Gulp tasks available.
 */
exports.clean = clean;
exports.default = series(clean, styles, revision);