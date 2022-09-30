const gulp = require("gulp");
const { src, dest, watch, parallel, series } = require("gulp");
const htmlmin = require("gulp-htmlmin");
const imagemin = require("gulp-imagemin");
const cleanCss = require("gulp-clean-css");
const concat = require("gulp-concat");
const terser = require("gulp-terser");
const browserSync = require("browser-sync");

const processhtml = require("gulp-processhtml");
const opts = {
  process: true,
};
//  Html file

var paths = {
  html: "project/*.html",
  css: "project/css/**/*.css",
  img: "project/pics/*",
  js: "project/js/**/*.js",
};

function minHtml() {
  return src(paths.html)
    .pipe(htmlmin({ collapseWhitespace: true, removeComments: true }))
    .pipe(gulp.dest("dist"));
}

exports.html = minHtml;

//  image function
function minImage() {
  return gulp.src(paths.img).pipe(imagemin()).pipe(gulp.dest("dist/images"));
}
exports.img = minImage;

// css Function

function minCss() {
  return src(paths.css)
    .pipe(cleanCss({ outputStyle: "compressed" }))
    .pipe(concat("all.min.css"))
    .pipe(dest("dist/assests/css"));
}
exports.css = minCss;

//  JS

function minJs() {
  return src(paths.js)
    .pipe(terser())
    .pipe(concat("all.min.js"))
    .pipe(dest("dist/assests/js"));
}
exports.js = minJs;

function serve(cb) {
  browserSync({
    server: {
      baseDir: "dist/",
    },
  });
  cb();
}

function reloadTask(done) {
  browserSync.reload();
  done();
}
//watch task
function watchTask() {
  watch(globs.html, series(minifyHTML, reloadTask));
  watch(globs.js, series(jsMinify, reloadTask));
  watch(globs.css, series(cssMinify, reloadTask));
  watch(globs.img, series(imgMinify, reloadTask));
}

exports.default = series(
  parallel(minImage, minJs, minCss, minHtml),
  serve,
  watchTask
);
