const { gulp, src, dest, watch, series } = require("gulp");

const sass = require("gulp-sass")(require("sass"));
const postcss = require("gulp-postcss");
const cssnano = require("cssnano");
const terser = require("gulp-terser");
const browsersync = require("browser-sync").create();
const autoprefixer = require("autoprefixer");
const csspurge = require("gulp-css-purge");

function scssTask() {
  let plugins = [csspurge, autoprefixer({ cascade: false }), cssnano];
  return src("static/scss/style.scss", { sourcemaps: true })
    .pipe(sass())
    .pipe(postcss(plugins))
    .pipe(dest(".", { sourcemaps: "." }));
}

function jsTask() {
  return src("static/js/index.js", { sourcemaps: true })
    .pipe(terser())
    .pipe(dest(".", { sourcemaps: "." }));
}

function serveTask(cb) {
  browsersync.init({
    server: {
      baseDir: ".",
    },
  });
  cb();
}

function reloadTask(cb) {
  browsersync.reload();
  cb();
}

function watchTask() {
  watch(["*.twig", "*.php", "templates/**/*.twig"], reloadTask);
  watch(
    ["static/**/**/*.scss", "static/**/*.js"],
    series(scssTask, jsTask, reloadTask)
  );
}

exports.default = series(scssTask, jsTask, serveTask, watchTask);
exports.build = series(scssTask, jsTask);
exports.watch = watchTask;
