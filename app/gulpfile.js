var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var babelify = require('babelify');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('scripts:main', function () {
    browserify(['js/main.js', 'js/dbhelper.js', 'js/restaurant_info.js'])
        .transform(babelify.configure({
            presets: ['env', 'react']
        }))
        .bundle()
        .pipe(source('main_bundle.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init())
        /* .pipe(uglify()) */
        .pipe(sourcemaps.write('maps')) // You need this if you want to continue using the stream with other plugins
        .pipe(gulp.dest('./dist/js'));
});
