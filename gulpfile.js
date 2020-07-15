'use strict';

const gulp = require('gulp');
const { src, parallel, series, dest, watch } = require('gulp')
const imagemin = require('gulp-imagemin');
const clean = require('gulp-clean');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const rename = require('gulp-rename');
const concat = require('gulp-concat');
const terser = require('gulp-terser');
const browserSync = require('browser-sync').create();

// user node sass for sass compiler
sass.compiler = require('node-sass');

// Root Folder
const files = {
    js: 'app/js/**/*.js',
    scss: 'app/scss/**/*.scss',
    img: 'app/images/*',
    fonts: 'app/fonts',
    dist: 'dist/'
}

// clean tasks
function cleanTaks() {
    return gulp.src(files.dist).pipe(clean())
}

// style 
function style() {
    return gulp.src(files.scss)
        .pipe(sourcemaps.init())
        .pipe(autoprefixer({
            cascade: false
        }))
        .pipe(sass({ outputStyle: 'compressed' })
            .on('error', sass.logError))
        .pipe(concat('all.css'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(files.dist + 'css'));
}

// script
function jsScript() {
    return gulp.src([files.js])
        .pipe(sourcemaps.init())
        .pipe(terser())
        .pipe(rename({ suffix: '.min' }))
        .pipe(sourcemaps.write('.'))
        .pipe(dest(files.dist + 'js'))
}

// Images
function images() {
    return gulp.src(files.img)
        .pipe(imagemin())
        .pipe(dest(files.dist + 'images'))
}

// Copy files
function cssCopy() {
    return gulp.src([
        'node_modules/bootstrap/dist/css/bootstrap.min.css',
        'node_modules/slick-carousel/slick/slick.css',
        'node_modules/slick-carousel/slick/slick-theme.css',
        'node_modules/font-awesome/css/font-awesome.min.css'
    ]).pipe(dest(files.dist + 'css'));
}

function jsCopy() {
    return gulp.src([
        'node_modules/bootstrap/dist/js/bootstrap.min.js',
        'node_modules/popper.js/dist/popper.min.js',
        'node_modules/slick-carousel/slick/slick.min.js',
    ])
        .pipe(dest(files.dist + 'js'));
}

function fontCopy() {
    return gulp.src('node_modules/font-awesome/fonts/*')
        .pipe(dest(files.dist + 'fonts'));
}

// Watcher
function watchs() {
    browserSync.init({
        server: {
            baseDir: './'
        }
    });
    gulp.watch('./*.html').on('change', browserSync.reload);
    gulp.watch(files.scss, style).on('change', browserSync.reload);
    gulp.watch(files.js, jsScript).on('change', browserSync.reload);
    gulp.watch(files.img, images).on('change', browserSync.reload);
}

// export functions
exports.style = style;
exports.clean = cleanTaks
exports.script = jsScript;
exports.images = images;
exports.cssCopy = cssCopy;
exports.watchs = watchs;
exports.jsCopy = jsCopy;
exports.fontCopy = fontCopy;

// default
exports.default = series(
    cleanTaks,
    parallel(style, jsScript, images, jsCopy, cssCopy, fontCopy),
    watchs
);
//exports.watch = watch

