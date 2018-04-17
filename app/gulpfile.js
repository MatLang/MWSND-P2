var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var babelify = require('babelify');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('scripts:main', function () {
    browserify(['js/main.js', 'js/dbhelper.js', 'js/restaurant_info.js'])
        .transform("babelify", { presets: ["env"] })
        .bundle()
        .pipe(source('main_bundle.js'))
        .pipe(gulp.dest("./dist/js"));
})