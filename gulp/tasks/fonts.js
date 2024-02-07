import fs from "fs";
import fonter from "gulp-fonter";
import ttf2woff2 from "gulp-ttf2woff2";

export const otfToTtf = () => {
  //ищем файлы шрифтов
  return (
    app.gulp
      .src(`${app.path.srcFolder}/fonts/*.otf`, {})
      .pipe(
        app.plugins.plumber(
          app.plugins.notify.onError({
            title: "Oops! Fonts error",
            message: "Error: <%= error.message %>",
          })
        )
      )
      //конвертируем в ttf
      .pipe(
        fonter({
          formats: ["ttf"],
        })
      )
      //выгружаем в исходную папку
      .pipe(app.gulp.dest(`${app.path.srcFolder}/fonts/`))
  );
};

export const ttfTofWoff = () => {
  //ищем конвертированные файлы в формате ttf
  return (
    app.gulp
      .src(`${app.path.srcFolder}/fonts/*.ttf`, {})
      .pipe(
        app.plugins.plumber(
          app.plugins.notify.onError({
            title: "Oops! Fonts error",
            message: "Error: <%= error.message %>",
          })
        )
      )
      //конвертируем в woff
      .pipe(
        fonter({
          formats: ["woff"],
        })
      )
      //выгружаем в папку с результатом
      .pipe(app.gulp.dest(`${app.path.build.fonts}`))
      //ищем шрифты ttf
      .pipe(app.gulp.src(`${app.path.srcFolder}/fonts/*.ttf`))
      //конвертируем в woff2
      .pipe(ttf2woff2())
      //выгружаем в папку с результатом
      .pipe(app.gulp.dest(`${app.path.build.fonts}`))
  );
};

export const fontsStyle = () => {
  //файл стилей подключений шрифтов
  let fontsFile = `${app.path.srcFolder}/scss/fonts.scss`;
  //проверяем существуют ли файлы шрифтов
  fs.readdir(app.path.build.fonts, function (err, fontsFiles) {
    if (fontsFiles) {
      //проверяем существует ли файл стилей для подключения шрифтов
      if (!fs.existsSync(fontsFile)) {
        //если файла нет то создаем его
        fs.writeFileSync(fontsFile, "", cd);
        let newFileOnly;
        for (var i = 0; i < fontsFiles.length; i++) {
          //записываем подключения шрифтов в файл стилей
          let fontFileName = fontsFiles[i].split(".")[0];
          if (newFileOnly !== fontFileName) {
            let fontName = fontFileName.split("-")[0]
              ? fontFileName.split("-")[0]
              : fontFileName;
            let fontWeight = fontFileName.split("-")[1]
              ? fontFileName.split("-")[1]
              : fontFileName;
            if (fontWeight.toLowerCase() === "thin") {
              fontWeight = 200;
            } else if (fontWeight.toLowerCase() === "extralight") {
              fontWeight = 200;
            } else if (fontWeight.toLowerCase() === "light") {
              fontWeight = 300;
            } else if (fontWeight.toLowerCase() === "medium") {
              fontWeight = 500;
            } else if (fontWeight.toLowerCase() === "semibold") {
              fontWeight = 600;
            } else if (fontWeight.toLowerCase() === "bold") {
              fontWeight = 700;
            } else if (
              fontWeight.toLowerCase() === "extrabold" ||
              fontWeight.toLowerCase() === "heavy"
            ) {
              fontWeight = 800;
            } else if (fontWeight.toLowerCase() === "black") {
              fontWeight = 900;
            } else {
              fontWeight = 400;
            }
            fs.appendFile(
              fontsFile,
              `@font-face {\n\tfont-family: '${fontName}';\n\tfont-display: swap;\n\tsrc: url('../fonts/${fontFileName}.woff') format('woff'), url('../fonts/${fontFileName}.woff2') format('woff2');\n\tfont-weight: ${fontWeight};\n\tfont-style: normal;\n}\r\n`,
              cd
            );
            newFileOnly = fontFileName;
          } else {
            console.log(
              "Файл scss/fonts.scss уже существует. Для обновления нужно его удалить!"
            );
          }
        }
      }
    }
  });
  return app.gulp.src(`${app.path.srcFolder}`);
  function cd() {}
};
