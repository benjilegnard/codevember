'use strict';

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    jade = require('gulp-jade'),
    connect = require('gulp-connect'),
    autoprefixer = require('gulp-autoprefixer'),
    minify = require('gulp-minify-css'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    ghPages = require('gulp-gh-pages'),
    data = require('gulp-data'),
    uglify = require('gulp-uglify'),
    eslint = require('gulp-eslint'),
    babel = require("gulp-babel"),
    fs = require('fs'),
    del = require('del');

var config = {
    src: './src/',
    dest: './build/',
    deps:'./node_modules/'
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

gulp.task('copy-libs',function(){
    return gulp.src([
            config.deps + 'delaunay-fast/delaunay.js',
            config.deps + 'matter-js/build/matter.js',
            config.deps + 'pixi.js/bin/pixi.js',
            config.deps + 'three/three.js',
            config.deps + 'gsap/three.js'
        ])
        .pipe(rename({dirname: ''}))
        .pipe(gulp.dest(config.dest+'/libs'));
});

gulp.task('es6to5',function(){

    return gulp.src(config.src +"**/*.js")
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['es2015']
        })).pipe(uglify())
        //.pipe(concat("all.js"))
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest(config.dest))
        .pipe(connect.reload());
});

gulp.task('jade', function () {
    gulp.src(config.src + '**/*.jade')
        .pipe(data(function(file) {
            return require('./data.json');
        }))
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

gulp.task('deploy',['build'], function() {
    return gulp.src(config.dest+'/**/*')
        .pipe(ghPages());
});

gulp.task('watch', function () {
    gulp.watch(config.src + '**/*.scss', ['sass']);
    gulp.watch(config.src + '**/*.jade', ['jade']);
    gulp.watch(config.src + '**/*.js', ['es6to5']);
});

gulp.task('clean', function () {
    return del([config.dest]);
});

gulp.task('build', ['copy-libs', 'sass', 'jade', 'es6to5']);
gulp.task('default', ['connect', 'watch']);
