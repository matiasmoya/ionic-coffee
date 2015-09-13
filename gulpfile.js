var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var coffee = require('gulp-coffee');
var ngAnnotate = require('gulp-ng-annotate');
var replace = require('gulp-replace-task');
var args    = require('yargs').argv;
var fs      = require('fs');

var paths = {
  sass: ['./scss/**/*.scss'],
  coffee: ['./www/**/*.coffee']
};

gulp.task('default', ['sass', 'coffee', 'replace']);

gulp.task('replace', function () {
  // Get the environment from the command line
  var env = args.env || 'development';

  // Read the settings from the right file
  var filename = env + '.json';
  var settings = JSON.parse(fs.readFileSync('./config/' + filename, 'utf8'));

// Replace each placeholder with the correct value for the variable.
gulp.src('www/app/constants/api.constants.js')
  .pipe(replace({
    patterns: [
      {
        match: 'apiUrl',
        replacement: settings.apiUrl
      }
    ]
  }))
  .pipe(gulp.dest('www/js/'));
});

gulp.task('coffee', ['replace'], function(done) {
  gulp.src(paths.coffee)
  .pipe(coffee({bare: true})
  .on('error', gutil.log.bind(gutil, 'Coffee Error')))
  .pipe(concat('application.js'))
  .pipe(ngAnnotate())
  .pipe(gulp.dest('./www/js'))
  .on('end', done)
})

gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass({
      errLogToConsole: true
    }))
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
  gulp.watch(paths.coffee, ['coffee']);
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});
