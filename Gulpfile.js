var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    rename = require('gulp-rename'),
    tinylr,
    connreload = require('connect-livereload'),
    express = require('express'),
    app = express();

gulp.task('styles', function() {
  return sass('styles', {style: 'expanded'})
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9'))
        .pipe(gulp.dest('styles'))
        .pipe(rename({suffix: '.min'}))
        .pipe(minifycss())
        .pipe(gulp.dest('styles'));
});

gulp.task('livereload', function() {
  tinylr = require('tiny-lr')();
  tinylr.listen(4002);  
});

var notifyLiveReload = function(event) {
  var fileName = require('path').relative(__dirname, event.path);
  tinylr.changed({ body: { files: [fileName] } });
}

gulp.task('watch', function() {
  gulp.watch('styles/*.scss', ['styles']); 
  gulp.watch('*.html', notifyLiveReload);
  gulp.watch('js/*.js', notifyLiveReload); 
});

gulp.task('express', function() {  
  app.use(connreload({port: 4002}));
  app.use(express.static(__dirname));
  app.listen(4000);
});

gulp.task('default', ['styles', 'express', 'livereload', 'watch'], function() {
    
});
