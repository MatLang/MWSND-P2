var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');

gulp.tasks('scripts:main', function () {
    browserify(['js/main.js', 'js/dbhelper.js', 'js/app.js'])
        .transform("babelify", { presets: ["env", "react"] })
        .bundle()
        .pipe(gulp.dest("./bundle.js"));
})