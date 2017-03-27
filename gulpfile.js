'use strict';

var gulp = require('gulp');
var angularFilesort = require('gulp-angular-filesort');
var bower = require('gulp-bower');
var connect = require('gulp-connect');
var inject = require('gulp-inject');
var gulpDocs = require('gulp-ngdocs');
var gulpOpen = require('gulp-open');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var watch = require('gulp-watch');
var mainBowerFiles = require('main-bower-files');
var merge = require('merge-stream');
var runSequence = require('run-sequence');
var minifyCss = require('gulp-minify-css');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var ngAnnotate = require('gulp-ng-annotate');
var bowerFiles = require('bower-files')();

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
        'generateDevView',
        'sass-dev',
        'injectDev');
});

// For dev purpose. Must have bower & npm install done previously
gulp.task('dev', function() {
    runSequence('generateDevView',
        'sass-dev',
        'injectDev');
    // load live reload server
});

// For prod purpose. Must have bower & npm install done previously
gulp.task('prod', function() {
    runSequence('generateProdView',
        'sass-prod',
        'injectProd');
    // load live reload server
});

gulp.task('update', function() {
    runSequence('bower',
        'generateDevView',
        'sass-dev',
        'injectDev');
});

// Inject bower components, angular components (module) and css
gulp.task('injectDev', function() {
    runSequence('inject-dev-bower',
        'inject-dev-angular',
        'inject-dev-css');
});

// Inject bower components, angular components (module) and css
gulp.task('injectProd', function() {
    runSequence('inject-prod-bower',
        'inject-prod-angular',
        'inject-prod-css');
});

gulp.task('watch', ['watchSass']);

// Compile sass
gulp.task('sass-dev', function() {
    gulp.src('./www/modules/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(rename({ extname: '.css' }))
        .pipe(gulp.dest('./www/modules/'));
});

// Compile sass
gulp.task('sass-prod', function() {
    gulp.src('./www/modules/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(minifyCss({
          keepSpecialComments: 0
        }))
        .pipe(rename({ extname: '.min.css' }))
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

gulp.task('generateDevView', function() {
    // createIndexHtml stream
    var createIndexHtml = gulp.src('./www/main-view/pre-index.html')
        .pipe(rename('index.html'))
        .pipe(gulp.dest('./www/'));
    // End of createIndexHtml stream

    // compileModuleSass stream
    var compileModuleSass = gulp.src('./www/modules/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./www/modules'));
    // End of compileModuleSass stream

    return merge(compileModuleSass, createIndexHtml);
});

gulp.task('generateProdView', function() {
    // createIndexHtml stream
    var createIndexHtml = gulp.src('./www/main-view/pre-index.html')
        .pipe(rename('index.html'))
        .pipe(gulp.dest('./dist/'));
    // End of createIndexHtml stream

    // compileModuleSass stream
    var compileModuleSass = gulp.src('./www/modules/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(minifyCss({
          keepSpecialComments: 0
        }))
        .pipe(concat('app.min.css'))
        .pipe(gulp.dest('./dist/'));
    // End of compileModuleSass stream
    
    var compileBowerCss = gulp.src(bowerFiles.ext('css').files)
        .pipe(minifyCss({
          keepSpecialComments: 0
        }))
        .pipe(concat('bower.min.css'))
        .pipe(gulp.dest('./dist/'));

    var compileBowerJs = gulp.src(bowerFiles.ext('js').files)
        .pipe(concat('bower.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/'));

    var compileModuleAngular = gulp.src(['./www/modules/**/*.js'])
        .pipe(angularFilesort())
        .pipe(concat('app.min.js'))
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(gulp.dest('./dist/'));

    var moveAllViews = gulp.src(['./www/modules/**/*.html'])
        .pipe(gulp.dest('./dist/modules/'))

    return merge(compileModuleSass, compileBowerCss, compileBowerJs, compileModuleAngular, moveAllViews, createIndexHtml);
});

gulp.task('inject-dev-bower', function() {
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

gulp.task('inject-prod-bower', function() {
    var target = gulp.src('./dist/index.html');
    var sources = gulp.src(['./dist/bower.min.js', './dist/bower.min.css']);                        

    return target
        .pipe(inject(sources, {
            name: 'bower',
            relative: 'true'
        }))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('inject-dev-angular', function() {
    var target = gulp.src('./www/index.html');
    var sources = gulp.src(['./www/modules/**/*.js']).pipe(angularFilesort());

    return target
        .pipe(inject(sources, {
            name: 'angular',
            relative: 'true'
        }))
        .pipe(gulp.dest('./www/'));
});

gulp.task('inject-prod-angular', function() {
    var target = gulp.src('./dist/index.html');
    var sources = gulp.src(['./dist/app.min.js']);                        

    return target
        .pipe(inject(sources, {
            name: 'angular',
            relative: 'true'
        }))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('inject-dev-css', function() {
    var target = gulp.src('./www/index.html');
    var sources = gulp.src(['./www/modules/**/*.css']);

    return target
        .pipe(inject(sources, {
            relative: 'true'
        }))
        .pipe(gulp.dest('./www/'));
});

gulp.task('inject-prod-css', function() {
    var target = gulp.src('./dist/index.html');
    var sources = gulp.src(['./dist/app.min.css']);

    return target
        .pipe(inject(sources, {
            relative: 'true'
        }))
        .pipe(gulp.dest('./dist/'));
});