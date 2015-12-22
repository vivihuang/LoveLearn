// Load plugins
var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    streamify = require('gulp-streamify'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    source = require('vinyl-source-stream'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    browserify = require('browserify'),
    del = require('del'),
    reactify = require('reactify');

// Styles
gulp.task('styles', function() {
  return sass('src/styles/main.scss', { style: 'expanded' })
    .pipe(autoprefixer('last 2 version'))
    //.pipe(gulp.dest('static/styles'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(minifycss())
    .pipe(gulp.dest('static/styles'))
    .pipe(notify({ message: 'Styles task complete' }));
});

// Scripts
gulp.task('src', function() {
  browserify('src/index.jsx')
    .transform(reactify)
    .bundle()
    .pipe(source('main.js'))
    //.pipe(gulp.dest('static/src'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(streamify(uglify()))
    .pipe(gulp.dest('static/src'))
    .pipe(notify({ message: 'Scripts task complete' }));
});

// Images
gulp.task('images', function() {
  return gulp.src('src/images/**/*')
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest('static/images'))
    .pipe(notify({ message: 'Images task complete' }));
});

// Clean
gulp.task('clean', function() {
  return del(['static/styles', 'static/src', 'static/images']);
});

// Default task
gulp.task('default', ['clean'], function() {
  gulp.start('styles', 'src', 'images');
});

// Watch
gulp.task('dev', ['default'], function() {
  // Watch .scss files
  gulp.watch('src/styles/**/*.scss', ['styles']);

  // Watch .js files
  gulp.watch('src/**/*.jsx', ['src']);

  gulp.watch('src/**/*.js', ['src']);

  // Watch image files
  gulp.watch('src/images/**/*', ['images']);

  // Create LiveReload server
  livereload.listen();

  // Watch any files in dist/, reload on change
  gulp.watch(['static/**']).on('change', livereload.changed);
  gulp.watch(['src/**']).on('change', livereload.changed);

});
