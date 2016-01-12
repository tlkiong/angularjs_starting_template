'use strict';

var del = require('del');
var gulp = require('gulp');
var angularFilesort = require('gulp-angular-filesort');
var bower = require('gulp-bower');
var connect = require('gulp-connect');
var inject = require('gulp-inject');
var gulpDocs = require('gulp-ngdocs');
var gulpOpen = require('gulp-open');
var plumber = require('gulp-plumber');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var watch = require('gulp-watch');
var mainBowerFiles = require('main-bower-files');
var merge = require('merge-stream');
var runSequence = require('run-sequence');

// ============== Convert this to a gulp task to create a gulp task - input, doc's title ==============

gulp.task('ngdocs', [], function() {
    var src = './docs/';

    gulp.watch('www/modules/**/*.js', function() {
        return gulp.src('www/modules/**/*.js')
            .pipe(gulpDocs.process({
                html5Mode: false,
                title: 'AngularJS Dropdown Directive'
            }))
            .pipe(gulp.dest(src));
    });

    connect.server({
        root: src,
        port: 8002,
        livereload: true
    });
    gulp.watch(src + '*', function() {
        return gulp.src(src).pipe(connect.reload());
    });
    gulp.src(__filename)
        .pipe(gulpOpen({
            uri: 'http://localhost:8002/'
        }));
});

// To run initial setup synchronously
gulp.task('setup', function() {
    runSequence('bower',
        'generateView',
        'sass',
        'inject');
});

// For dev purpose. Must have bower & npm install done previously
gulp.task('dev', function() {
    runSequence('generateView',
        'sass',
        'inject');
    // load live reload server
});

gulp.task('update', function() {
    runSequence('bower',
        'generateView',
        'sass',
        'inject');
});

// Inject bower components, angular components (module) and css
gulp.task('inject', function() {
    runSequence('inject-bower',
        'inject-angular',
        'inject-css');
});

gulp.task('watch', ['watchSass']);

// Compile sass
gulp.task('sass', function() {
    gulp.src('./www/modules/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./www/modules/'));
});

gulp.task('watchSass', function() {
    gulp.watch('./www/modules/**/*.scss', ['sass']);
});

gulp.task('bower', function() {
    return bower({
        cmd: 'install'
    });
});

gulp.task('generateView', function() {
    // createIndexHtml stream
    var createIndexHtml = gulp.src('./www/main-view/pre-index.html')
        .pipe(rename('index.html'))
        .pipe(gulp.dest('./www/'));
    // End of createIndexHtml stream

    // compileModuleSass stream
    var compileModuleSass = gulp.src('./www/modules/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./www/css'));
    // End of compileModuleSass stream

    return merge(compileModuleSass, createIndexHtml);
});

gulp.task('inject-bower', function() {
    var bowerOptions = {
        paths: {
            bowerDirectory: './www/lib',
            bowerrc: './.bowerrc',
            bowerJson: './bower.json'
        }
    };

    var target = gulp.src('./www/index.html');
    var sources = gulp.src(mainBowerFiles(bowerOptions), {
        read: false
    });

    return target
        .pipe(inject(sources, {
            name: 'bower',
            relative: 'true'
        }))
        .pipe(gulp.dest('./www/'));
});

gulp.task('inject-angular', function() {
    var target = gulp.src('./www/index.html');
    var sources = gulp.src(['./www/modules/**/*.js']).pipe(angularFilesort());

    return target
        .pipe(inject(sources, {
            name: 'angular',
            relative: 'true'
        }))
        .pipe(gulp.dest('./www/'));
});

gulp.task('inject-css', function() {
    var target = gulp.src('./www/index.html');
    var sources = gulp.src(['./www/modules/**/*.css']);

    return target
        .pipe(inject(sources, {
            relative: 'true'
        }))
        .pipe(gulp.dest('./www/'));
});
