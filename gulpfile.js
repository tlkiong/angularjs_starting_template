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
var pump = require('pump');
var fs = require('fs');
var crypto = require('crypto');
var rimraf = require('rimraf');
var preprocess = require('gulp-preprocess');
var del = require('del');

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
gulp.task('injectProd', ['hash-prod-items'], function() {
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
  gulp.watch('./www/modules/**/*.scss', ['sass-dev']);
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
  
  // Move app settings file
  var processAppSettings = gulp.src('./app-settings.js')
    .pipe(preprocess({context: { ENV: 'DEV', DEBUG: true}}))
    .pipe(gulp.dest('./www/'));
  // End of Move app settings file

  return merge(processAppSettings, compileModuleSass, createIndexHtml);
});

gulp.task('clearDist', function(done) {
  rimraf('./dist', function () {
    done();
  });
})

gulp.task('generateProdView',['clearDist'], function(cb) {
  // createIndexHtml stream
  var createIndexHtml = gulp.src('./www/main-view/pre-index.html')
    .pipe(rename('index.html'))
    .pipe(gulp.dest('./dist/'));
  // End of createIndexHtml stream

  // compileModuleSass stream
  var compileModuleSass = gulp.src('./www/modules/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(minifyCss({
      keepSpecialComments: 0,
      processImport: false
    }))
    .pipe(concat('app.min.css'))
    .pipe(gulp.dest('./dist/'));
  // End of compileModuleSass stream

  var compileModuleAngular = pump([
      gulp.src(['./www/modules/**/*.js']),
      angularFilesort(),
      concat('app.min.js'),
      ngAnnotate(),
      uglify(),
      gulp.dest('./dist/')
    ])

  var moveAllViews = gulp.src(['./www/modules/**/*.html'])
    .pipe(gulp.dest('./dist/modules/'))

  var moveAllResources = gulp.src(['./www/resources/**/*'], {
      base: './www/resources'
    })
    .pipe(gulp.dest('./dist/resources'))

  var compileBowerJs = pump([
      gulp.src(bowerFiles.ext('js').files),
      concat('bower.min.js'),
      uglify(),
      gulp.dest('./dist/')
    ]);

  // Move app settings file
  var processAppSettings = gulp.src('./app-settings.js')
    .pipe(preprocess({context: { ENV: 'PROD', DEBUG: true}}))
    .pipe(gulp.dest('./dist/'));
  // End of Move app settings file

  if(bowerFiles.ext('css').files.length > 0) {
    var compileBowerCss = gulp.src(bowerFiles.ext('css').files)
      .pipe(minifyCss({
        keepSpecialComments: 0
      }))
      .pipe(concat('bower.min.css'))
      .pipe(gulp.dest('./dist/'));

    return merge(processAppSettings, compileModuleSass, compileBowerCss, compileBowerJs, compileModuleAngular, moveAllViews, moveAllResources, createIndexHtml);
  }

  return merge(processAppSettings, compileModuleSass, compileBowerJs, compileModuleAngular, moveAllViews, moveAllResources, createIndexHtml);
});

var bowerProdFilePathList = [];
var angularProdFilePathList = [];
var stylesProdFilePathList = [];

gulp.task('hash-prod-items', function(done) {
  var counter = 0;
  ['app.min.css', 'app.min.js', 'bower.min.css', 'bower.min.js']
    .forEach(function(e) {
      var destStr = './dist/' + e;
      fs.createReadStream(destStr)
        .pipe(crypto.createHash('sha1')
                    .setEncoding('hex'))
        .on('finish', function () {
          var sha1Hash = this.read();
          
          var destStrFilePathWithoutExt = '.' + destStr.split('.')[1];
          var fileExt = destStr.substring(destStrFilePathWithoutExt.length);
          var fullPath = destStrFilePathWithoutExt + '-' + sha1Hash + fileExt;

          fs.rename(destStr, fullPath, function(err) {
            if (err) {
              console.log('ERROR in renaming file: ' + err)
            } else {
              if(fullPath.indexOf('bower') > -1) {
                bowerProdFilePathList.push(fullPath);
              } else {
                if(fullPath.indexOf('.js') > -1) {
                  angularProdFilePathList.push(fullPath);
                } else if (fullPath.indexOf('.css') > -1) {
                  stylesProdFilePathList.push(fullPath);
                }
              }

              counter++;
              if(counter === 4) {
                done();
              }
            }
          });
        });
    });
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
  var sources = gulp.src(bowerProdFilePathList);

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
  var sources = gulp.src(angularProdFilePathList);

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
  var sources = gulp.src(stylesProdFilePathList);

  return target
    .pipe(inject(sources, {
      relative: 'true'
    }))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('cleanProd', function() {
  return del(['./www/modules/**/*.min.css']);
});