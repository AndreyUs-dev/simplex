////////////////
// IMPORTS

import gulp from 'gulp'
import del from 'del'
import dartSass from 'sass'
import gulpSass from 'gulp-sass'
const sass = gulpSass(dartSass)
import autoprefixer from 'gulp-autoprefixer'
import webpack from 'webpack-stream'
import imagemin from 'gulp-imagemin'
import gulpif from 'gulp-if'
import browserSync from 'browser-sync'
import gulpIf from 'gulp-if'
const server = browserSync.create()

/////////////////
// SERVER

const serve = () => {
  server.init({
    server: {
      baseDir: 'dist/',
    },
  })
}

/////////////////
// PATHS

const path = {
  build: {
    html: 'dist/',
    css: 'dist/css/',
    js: 'dist/js/',
    img: 'dist/img/',
    fonts: 'dist/fonts/',
    video: 'dist/video/',
  },
  src: {
    html: 'src/*.html',
    scss: 'src/scss/main.scss',
    js: 'src/js/main.js',
    img: 'src/img/**/*.{jpg,jpeg,png,gif,webp,svg}',
    video: 'src/video/**/*.{mp4, webp}',
    fonts: 'src/fonts/*.{eot,svg,ttf,woff}',
  },
  watch: {
    html: 'src/*.html',
    scss: 'src/scss/**/*.scss',
    js: 'src/js/**/*.js',
    img: 'src/img/**/*.{jpg,jpeg,png,gif,webp,svg}',
    video: 'src/video/**/*.{mp4, webp}',
    fonts: 'src/fonts/',
  },
}

const isBuild = process.argv.includes('--build')
const inDev = !process.argv.includes('--build')

///////////////
// HTML

const html = () => {
  return gulp
    .src(path.src.html)
    .pipe(gulp.dest(path.build.html))
    .pipe(server.stream())
}

///////////////
// STYLES

const styles = () => {
  return gulp
    .src(path.src.scss)
    .pipe(sass())
    .pipe(
      gulpIf(
        isBuild,
        autoprefixer({
          grid: true,
          overrideBrowserslist: ['last 3 versions'],
          cascade: true,
        })
      )
    )
    .pipe(gulp.dest(path.build.css))
    .pipe(server.stream())
}

///////////////
// JS

const js = () => {
  return gulp
    .src(path.src.js, { sourcemaps: true })
    .pipe(
      webpack({
        mode: isBuild ? 'production' : 'development',
        output: {
          filename: 'main.js',
        },
      })
    )
    .pipe(gulp.dest(path.build.js))
    .pipe(server.stream())
}

///////////////
// IMAGES

const images = () => {
  return gulp
    .src(path.src.img)
    .pipe(
      imagemin({
        progressive: true,
        svgoPlugins: [{ removeViewBox: false }],
        interlaced: true,
        optimizationLevel: 3,
      })
    )
    .pipe(gulp.dest(path.build.img))
}

///////////////
// FONTS

const fonts = () => {
  return gulp.src(path.src.fonts).pipe(gulp.dest(path.build.fonts))
}

///////////////
// COPY

const copy = () => {
  return gulp.src(path.src.img).pipe(gulp.dest(path.build.img))
}

///////////////
// VIDEO

const video = () => {
  return gulp.src(path.src.video).pipe(gulp.dest(path.build.video))
}

////////////
// CLEAN

const clean = () => {
  return del('dist/')
}

/////////////
// WATCH

function watch() {
  gulp.watch(path.watch.html, html)
  gulp.watch(path.watch.scss, styles)
  gulp.watch(path.watch.js, js)
  gulp.watch(path.watch.img, images)
  gulp.watch(path.watch.video, video)
  gulp.watch(path.watch.fonts, fonts)
}

const mainTasks = gulp.parallel(copy, video, html, styles, js, images, fonts)

const dev = gulp.series(clean, mainTasks, gulp.parallel(watch, serve))
const build = gulp.series(clean, mainTasks)

/////////////
// EXPORT

export { dev }
export { build }

gulp.task('default', dev)
