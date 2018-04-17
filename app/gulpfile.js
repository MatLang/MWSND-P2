/* var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var babelify = require('babelify');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps'); */

/* gulp.task('scripts:main', function () {
    browserify(['js/dbhelper.js','js/main.js'])
        .transform(babelify.configure({
            presets: ['env', 'react']
        }))
        .bundle()
        .pipe(source('main_bundle.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(sourcemaps.write('maps'))
        .pipe(gulp.dest('./dist/js'));
}); */

var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var runSequence = require('run-sequence');
var del = require('del');
var assign = require('lodash/object/assign');
var browserify = require('browserify');
var watchify = require('watchify');
var babelify = require('babelify');
var hbsfy = require('hbsfy');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var mergeStream = require('merge-stream');
var through = require('through2');

function createBundle(src) {
    if (!src.push) {
        src = [src];
    }

    var customOpts = {
        entries: src,
        debug: true
    };
    var opts = assign({}, watchify.args, customOpts);
    var b = watchify(browserify(opts));

    b.transform(babelify.configure({
        stage: 1
    }));

    b.transform(hbsfy);
    b.on('log', plugins.util.log);
    return b;
}

function bundle(b, outputPath) {
    var splitPath = outputPath.split('/');
    var outputFile = splitPath[splitPath.length - 1];
    var outputDir = splitPath.slice(0, -1).join('/');

    return b.bundle()
        // log errors if they happen
        .on('error', plugins.util.log.bind(plugins.util, 'Browserify Error'))
        .pipe(source(outputFile))
        // optional, remove if you don't need to buffer file contents
        .pipe(buffer())
        // optional, remove if you dont want sourcemaps
        .pipe(plugins.sourcemaps.init({ loadMaps: true })) // loads map from browserify file
        // Add transformation tasks to the pipeline here.
        .pipe(plugins.sourcemaps.write('./')) // writes .map file
        .pipe(gulp.dest('build/public/' + outputDir));
}

var jsBundles = {
    'js/dbhelper.js': createBundle('./js/dbhelper.js'),
    'js/main.js': createBundle('./js/main.js'),
    'js/restaurant_info.js': createBundle('./js/restaurant_info.js'),
    /* 'sw.js': createBundle(['./public/js/sw/index.js', './public/js/sw/preroll/index.js']) */
};

gulp.task('js:browser', function () {
    return mergeStream.apply(null,
        Object.keys(jsBundles).map(function (key) {
            return bundle(jsBundles[key], key);
        })
    );
});
