var gulp = require('gulp')
, del = require('del')
, url = require('url')
, jshint = require('gulp-jshint')
, connect = require('gulp-connect')
, proxy = require('proxy-middleware')
, minimist = require('minimist')
, imagemin = require('gulp-imagemin')
, sass = require('gulp-sass')
, glob = require('glob')
, fs = require('fs')
, path = require('path')
, _ = require("lodash");

var args = minimist(process.argv.slice(2), {
  default: {
    dist: 'dist'
  , O: false
  }
});

var dist_root = args.dist;
var optimize = args.O;

var paths = {
  index: 'index.html'
, scripts: 'js/**/*.js'
, templates: 'templates/**/*.html'
, styles: 'css/**/*.scss'
, images: 'img/**/*'
, videos: 'videos/**/*'
};


// build

gulp.task('clean', function(cb) {
  del([dist_root], cb);
});

gulp.task('index', ['clean'], function() {
  return gulp.src(paths.index)
    .pipe(gulp.dest(dist_root));
});

gulp.task('scripts', ['clean'], function() {
  return gulp.src(paths.scripts)
    // .pipe(uglify())
    // .pipe(concat('all.min.js'))
    .pipe(gulp.dest(dist_root + '/js'));
});

gulp.task('templates', ['clean'], function() {
  return gulp.src(paths.templates)
    .pipe(gulp.dest(dist_root + '/templates'));
});

gulp.task('styles', ['clean'], function() {
  return gulp.src(paths.styles)
    .pipe(sass())
    .pipe(gulp.dest(dist_root + '/css'));
});

gulp.task('images', ['clean'], function() {
  var src = gulp.src(paths.images)
  var res = (optimize ? src.pipe(imagemin({optimizationLevel: 1})) : src);

  return res.pipe(gulp.dest(dist_root + '/img'));
});

gulp.task('videos', ['clean'], function() {
  return gulp.src(paths.videos)
    .pipe(gulp.dest(dist_root + '/videos'));
});

gulp.task('copy', ['index', 'scripts', 'templates', 'styles', 'images', 'videos']);

gulp.task('lint', function() {
  return gulp.src('js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('build', ['copy']);


// dev

var wrap = function(name, content) {
    return '<script type="text/html" id="' + name + '">' + content + '</script>';
};

gulp.task('connect', function() {
    connect.server({
        root: dist_root,
        livereload: true,
        middleware: function(connect, o) {
            return [
                (function() {
                    var options = url.parse('http://localhost:80/api');
                    options.route = '/api';
                    return proxy(options);
                })(),
                function (req, res, next) {
                    if (req.originalUrl !== '/') return next();

                    glob("**/*.ko", function (er, files) {
                        var tpls =_.reduce(files, function (acc, file) {
                            return acc +  wrap(path.basename(file, '.ko'), fs.readFileSync(file, 'utf8'));
                        }, '');

                        var index = fs.readFileSync('index.html', 'utf8');
                        res.end(index + tpls);
                    });
                }
            ];
        }
    });
});

gulp.task('reload', ['build'], function () {
  gulp.src(dist_root + '/*.html')
    .pipe(connect.reload());
});

gulp.task('watch', function() {
  gulp.watch(paths.index, ['index']);
  gulp.watch(paths.scripts, ['scripts']);
  gulp.watch(paths.templates, ['templates']);
  gulp.watch(paths.styles, ['styles']);
  gulp.watch(paths.images, ['images']);
  gulp.watch(paths.videos, ['videos']);
});

gulp.task('default', ['build', 'connect', 'watch']);
