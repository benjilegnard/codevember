'use strict';

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    jade = require('gulp-jade'),
    connect = require('gulp-connect'),
    autoprefixer = require('gulp-autoprefixer'),
    minify = require('gulp-minify-css'),
    concat = require('gulp-concat'),
    ghPages = require('gulp-gh-pages'),
    uglify = require('gulp-uglify'),
    eslint = require('gulp-eslint');

var config = {
    src: './2015/',
    dest: './build/'
};

gulp.task('lint', function () {
    return gulp.src([config.src + '**/*.js'])
        // eslint() attaches the lint output to the eslint property
        // of the file object so it can be used by other modules.
        .pipe(eslint())
        // eslint.format() outputs the lint results to the console.
        // Alternatively use eslint.formatEach() (see Docs).
        .pipe(eslint.format())
        // To have the process exit with an error code (1) on
        // lint error, return the stream and pipe to failAfterError last.
        .pipe(eslint.failAfterError());
});

gulp.task('jade', function () {
    gulp.src(config.src + '**/*.jade')
        .pipe(jade())
        .pipe(gulp.dest(config.dest))
        .pipe(connect.reload());
});

gulp.task('sass', function () {
    gulp.src(config.src + '**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(config.dest))
        .pipe(connect.reload());
});

gulp.task('connect', function () {
    connect.server({
        root: config.dest,
        livereload: true
    });
});

gulp.task('watch', function () {
    gulp.watch(config.src + '**/*.scss', ['sass']);
    gulp.watch(config.src + '**/*.jade', ['jade']);
});

gulp.task('default', ['connect', 'watch']);
