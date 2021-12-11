"use strict";

const {
  src,
  dest
} = require("gulp");
const gulp = require("gulp");
const autoprefixer = require("gulp-autoprefixer");
const cssbeautify = require("gulp-cssbeautify");
const removeComments = require("gulp-strip-css-comments");
const rename = require("gulp-rename");
const sass = require("gulp-sass")(require("sass"));
const cssnano = require("gulp-cssnano");
const plumber = require("gulp-plumber");
const panini = require("panini");
// const image = require("gulp-image");
const del = require("del");
const notify = require("gulp-notify");
const browserSync = require("browser-sync").create();
const fileinclude = require("gulp-file-include");
const webp = require("gulp-webp");
const webphtml = require("gulp-webp-html");
const webpcss = require("gulp-webpcss");
const ttf2woff = require("gulp-ttf2woff");
const ttf2woff2 = require("gulp-ttf2woff2");

const srcPath = '#src/';
const distPath = 'dist/';

const path = {
  build: {
    html: distPath,
    js: distPath + "js/",
    css: distPath + "css/",
    images: distPath + "img/",
    fonts: distPath + "fonts/"
  },
  src: {

    html: srcPath + "*.html",
    js: srcPath + "*.js",
    css: srcPath + "*.scss",
    images: srcPath + "img/**/*.{jpg,png,svg,gif,ico,webp,webmanifest,xml,json}",
    fonts: srcPath + "fonts/**/*.{eot,woff,woff2,ttf,svg,otf}"
  },
  watch: {
    html: srcPath + "**/*.html",
    js: srcPath + "**/*.js",
    css: srcPath + "**/*.scss",
    images: srcPath + "img/**/*.{jpg,png,svg,gif,ico,webp,webmanifest,xml,json}",
    fonts: srcPath + "fonts/**/*.{eot,woff,woff2,ttf,svg,otf}"
  },
  clean: "./" + distPath
}

function serve() {
  browserSync.init({
    server: {
      baseDir: "./" + distPath
    }, // путь старта
    notify: false, // true - показывать уведеомления, false не показывать
    online: true, // true - рабоать с интернетом, доступ по IP для тестирования на телефоне, false - без интернета
    port: 3000, // порт для подключения
  });
}



// function html(cb) {
//   panini.refresh();
//   return src(path.src.html, {
//       base: srcPath
//     })
//     .pipe(plumber())
//     .pipe(panini({
//       root: srcPath,
//       layouts: srcPath + 'auxiliary/layouts/',
//       partials: srcPath + 'root/',
//       helpers: srcPath + 'auxiliary/helpers/',
//       data: srcPath + 'auxiliary/data/'
//     }))
//     .pipe(webphtml())
//     .pipe(dest(path.build.html))
//     .pipe(browserSync.reload({
//       stream: true
//     }));

//   cb();
// }

function html(cb) {
  return src(path.src.html)
    .pipe(fileinclude())
    .pipe(webphtml())
    .pipe(dest(path.build.html))
    .pipe(browserSync.reload({
      stream: true
    }));

  cb();
}



function css(cb) {
  return src(path.src.css, {
      base: srcPath + "/"
    })
    .pipe(plumber({
      errorHandler: function (err) {
        notify.onError({
          title: "SCSS Ошибка",
          message: "Ошибка: <%= error.message %>"
        })(err);
        this.emit('end');
      }
    }))
    .pipe(sass({
      includePaths: './node_modules/'
    }))
    .pipe(
      autoprefixer({
        overrideBrowserslist: [
          "last 5 version",
          "> 1%",
        ],
        cascade: true
      })
    )
    .pipe(webpcss())
    .pipe(cssbeautify())
    .pipe(dest(path.build.css))
    .pipe(cssnano({
      zindex: false,
      discardComments: {
        removeAll: true
      }
    }))
    .pipe(removeComments())
    .pipe(rename({
      suffix: ".min",
      extname: ".css"
    }))
    .pipe(dest(path.build.css))
    .pipe(browserSync.reload({
      stream: true
    }));

  cb();
}

function cssWatch(cb) {
  return src(path.src.css, {
      base: srcPath + "/"
    })
    .pipe(plumber({
      errorHandler: function (err) {
        notify.onError({
          title: "SCSS Ошибка",
          message: "Ошибка: <%= error.message %>"
        })(err);
        this.emit('end');
      }
    }))
    .pipe(sass({
      includePaths: './node_modules/'
    }))
    .pipe(rename({
      suffix: ".min",
      extname: ".css"
    }))
    .pipe(dest(path.build.css))
    .pipe(browserSync.reload({
      stream: true
    }));

  cb();
}

function js(cb) {
  return src(path.src.js, {
      base: srcPath + '/'
    })
    .pipe(plumber({
      errorHandler: function (err) {
        notify.onError({
          title: "JS Ошибка",
          message: "Ошибка: <%= error.message %>"
        })(err);
        this.emit('end');
      }
    }))
    .pipe(fileinclude())
    .pipe(dest(path.build.js))
    .pipe(browserSync.reload({
      stream: true
    }));

  cb();
}

function jsWatch(cb) {
  return src(path.src.js, {
      base: srcPath + '/'
    })
    .pipe(plumber({
      errorHandler: function (err) {
        notify.onError({
          title: "JS Ошибка",
          message: "Ошибка: <%= error.message %>"
        })(err);
        this.emit('end');
      }
    }))
    .pipe(fileinclude())
    .pipe(dest(path.build.js))
    .pipe(browserSync.reload({
      stream: true
    }));

  cb();
}

function images(cb) {
  return src(path.src.images)
    .pipe(
      webp({
        quality: 70
      })
    )
    .pipe(dest(path.build.images))
    .pipe(src(path.src.images))
    // .pipe(image({
    //   pngquant: true,
    //   optipng: false,
    //   zopflipng: true,
    //   jpegRecompress: false,
    //   mozjpeg: true,
    //   gifsicle: true,
    //   svgo: true,
    //   concurrent: 10
    // }))
    .pipe(dest(path.build.images))
    .pipe(browserSync.reload({
      stream: true
    }));

  cb();
}

function fonts(cb) {
  src(path.src.fonts)
    .pipe(dest(path.build.fonts))
    .pipe(ttf2woff())
    .pipe(dest(path.build.fonts))
  return src(path.src.fonts)
    .pipe(ttf2woff2())
    .pipe(dest(path.build.fonts))
    .pipe(browserSync.reload({
      stream: true
    }));

  cb();
}









// function font_weight(font_name) {
//     if (font_name.split(".", 0).endsWith("Black")) {
//         return "900";
//     }
//     else if (font_name.split(".", 0).endsWith("Bold")) {
//         return "700";
//     }
//     else if (font_name.split(".", 0).endsWith("Normal")) {
//         return "400";
//     }
//     else if (font_name.split(".", 0).endsWith("Regular")) {
//         return "400";
//     }
//     else if (font_name.split(".", 0).endsWith("Light")) {
//         return "300";
//     }
//     cb();
// }

// let fs = require('fs');

// function fontsStyle(cb) {
//     let file_content = fs.readFileSync(srcPath + '**/_fonts.scss');
//     if (file_content == '') {
//         fs.writeFile(srcPath + '**/_fonts.scss', '', cb);
//         return fs.readdir(path.build.fonts, function (err, items) {
//             if (items) {
//                 let c_fontname;
//                 for (var i = 0; i < items.length; i++) {
//                     let fontname = items[i].split('.');
//                     fontname = fontname[0];
//                     if (c_fontname != fontname) {
//                         fs.appendFile(srcPath + '/root/shared_chunk/fonts/_fonts.scss', '@include font("' + fontname + '", "' + fontname + '", "' + font_weight(fontname) + '", "normal");\r\n', cb());
//                     }
//                     c_fontname = fontname;
//                 }
//             }
//         })
//     }
// }










function clean(cb) {
  return del(path.clean);

  cb();
}

function watchFiles() {
  gulp.watch([path.watch.html], html);
  gulp.watch([path.watch.css], cssWatch);
  gulp.watch([path.watch.js], jsWatch);
  gulp.watch([path.watch.images], images);
  gulp.watch([path.watch.fonts], fonts);
}

const build = gulp.series(clean, gulp.parallel(html, css, js, images, fonts));
const watch = gulp.parallel(build, watchFiles, serve);

exports.html = html;
exports.css = css;
exports.js = js;
exports.images = images;
exports.fonts = fonts;
exports.clean = clean;
exports.build = build;
exports.watch = watch;
exports.default = watch;