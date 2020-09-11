'use strict';

const del = require('delete');
const { src, dest, watch, series, parallel } = require('gulp');
const gulpif = require('gulp-if');
const sass = require('gulp-sass');
const scsslint = require('gulp-scss-lint');
const autoprefix = require('gulp-autoprefixer');
const uglify = require('gulp-uglify-es').default;
const concat = require('gulp-concat');
const rev = require('gulp-rev');

var pkg = require('./package.json');
var env = require('./env.json');

function clean() {
  return del(pkg.paths.src.clean);
}

function styles() {
  return src(pkg.paths.src.scss)
    .pipe(gulpif(!env.production, scsslint()))
    .pipe(sass({outputStyle: !env.production ? 'expanded' : 'compressed'})
    .on('error', sass.logError))
    .pipe(autoprefix())
    .pipe(dest(pkg.paths.dest.css));
}

function scripts() {
  return src(pkg.paths.src.js)
    .pipe(gulpif(env.production, uglify()))
    .pipe(concat('screen.js'))
    .pipe(dest(pkg.paths.dest.js))
}

function revision() {
  return src(pkg.paths.src.rev, {base: './web/'})
    .pipe(rev())
    .pipe(dest(pkg.paths.dest.rev))
    .pipe(rev.manifest('manifest.json', {merge: true}))
    .pipe(dest(pkg.paths.dest.rev))
}

exports.clean = clean;
exports.styles = styles;
exports.scripts = scripts;
exports.revision = revision;
exports.default = series(clean, parallel(styles, scripts), revision);
