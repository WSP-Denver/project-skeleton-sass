// package vars
const pkg = require("./package.json");

// gulp
const gulp = require("gulp");

var browserSync = require('browser-sync').create();

// load all plugins in "devDependencies" into the variable $
const $ = require("gulp-load-plugins")({
    pattern: ["*"],
    scope: ["devDependencies"]
});

const onError = (err) => {
    console.log(err);
};

const banner = [
    "/**",
    " * @project        <%= pkg.name %>",
    " * @author         <%= pkg.author %>",
    " * @build          " + $.moment().format("llll") + " ET",
    //" * @release        " + $.gitRevSync.long() + " [" + $.gitRevSync.branch() + "]",
    //" * @copyright      Copyright (c) " + $.moment().format("YYYY") + ", <%= pkg.copyright %>",
    " *",
    " */",
    ""
].join("\n");


// scss - build the scss to the build folder, including the required paths, and writing out a sourcemap
gulp.task("scss", () => {
    $.fancyLog("-> Compiling Main scss");
    return gulp.src(pkg.paths.src.scss + pkg.vars.scssName)
        .pipe($.plumber({ errorHandler: onError }))
        .pipe($.sourcemaps.init({ loadMaps: true }))
        .pipe($.sass({
            includePaths: pkg.paths.scss
        })
            .on("error", $.sass.logError))
        .pipe($.cached("sass_compile"))
        .pipe($.autoprefixer())
        .pipe($.pxtorem())
        .pipe($.sourcemaps.write("./"))
        .pipe($.size({ gzip: true, showFiles: true }))
        .pipe(gulp.dest(pkg.paths.dist.css))
        .pipe(browserSync.stream());
});

// scss - build the scss to the build folder, including the required paths, and writing out a sourcemap
gulp.task("mqscss", () => {
    $.fancyLog("-> Compiling Media Query scss");
    return gulp.src(pkg.paths.src.scss + pkg.vars.mqscssName)
        .pipe($.plumber({ errorHandler: onError }))
        .pipe($.sourcemaps.init({ loadMaps: true }))
        .pipe($.sass({
            includePaths: pkg.paths.scss
        })
            .on("error", $.sass.logError))
        .pipe($.cached("sass_compile"))
        .pipe($.autoprefixer())
        .pipe($.pxtorem())
        .pipe($.sourcemaps.write("./"))
        .pipe($.size({ gzip: true, showFiles: true }))
        .pipe(gulp.dest(pkg.paths.dist.css))
        .pipe(browserSync.stream());
});

// css task - add main.css distribution CSS into the public css folder, and add our banner to it
gulp.task("css", ["scss"], () => {
    $.fancyLog("-> Building Main css");
    return gulp.src(pkg.globs.distCss)
        .pipe($.plumber({ errorHandler: onError }))
        .pipe($.newer({ dest: pkg.paths.dist.css }))
        .pipe($.print())
        .pipe($.sourcemaps.init({ loadMaps: true }))
        .pipe($.header(banner, { pkg: pkg }))
        .pipe($.sourcemaps.write("./"))
        .pipe($.size({ gzip: true, showFiles: true }))
        .pipe(gulp.dest(pkg.paths.dist.css))
        .pipe($.filter("**/*.css"))
        //.pipe($.livereload());
});
// css task - add media_queries.css distribution CSS into the public css folder, and add our banner to it
gulp.task("mqcss", ["mqscss"], () => {
    $.fancyLog("-> Building Media Query css");
    return gulp.src(pkg.globs.distCss)
        .pipe($.plumber({ errorHandler: onError }))
        .pipe($.newer({ dest: pkg.paths.dist.css }))
        .pipe($.print())
        .pipe($.sourcemaps.init({ loadMaps: true }))
        .pipe($.header(banner, { pkg: pkg }))
        .pipe($.sourcemaps.write("./"))
        .pipe($.size({ gzip: true, showFiles: true }))
        .pipe(gulp.dest(pkg.paths.dist.css))
        .pipe($.filter("**/*.css"))
        //.pipe($.livereload());
});

// css task - combine & minimize any vendor CSS into the public css folder, and add our banner to it
gulp.task("vendorcss", () => {
    $.fancyLog("-> Building Vendor css");
    return gulp.src(pkg.globs.vendorCss)
        .pipe($.plumber({ errorHandler: onError }))
        .pipe($.newer({ dest: pkg.paths.dist.css }))
        .pipe($.print())
        .pipe($.sourcemaps.init({ loadMaps: true }))
        .pipe($.concat(pkg.vars.vendorCssName))
         .pipe($.cssnano({
            discardDuplicates: true,
            discardEmpty: true,
            minifyFontValues: true,
            minifySelectors: true
        }))  
        //+ pkg.vars.siteCssName */
        .pipe($.header(banner, { pkg: pkg }))
        .pipe($.sourcemaps.write("./"))
        .pipe($.size({ gzip: true, showFiles: true }))
        .pipe(gulp.dest(pkg.paths.dist.css))
        .pipe($.filter("**/*.css"))
        //.pipe($.livereload());
});

// inline js task - minimize the inline Javascript into _inlinejs in the templates path
gulp.task("js-inline", () => {
    $.fancyLog("-> Copying inline js");
    return gulp.src(pkg.globs.inlineJs)
        .pipe($.plumber({ errorHandler: onError }))
        .pipe($.if(["*.js", "!*.min.js"],
            $.newer({ dest: pkg.paths.templates + "_inlinejs", ext: ".min.js" }),
            $.newer({ dest: pkg.paths.templates + "_inlinejs" })
        ))
        /* .pipe($.if(["*.js", "!*.min.js"],
            $.uglify()
        )) */
        .pipe($.if(["*.js", "!*.min.js"],
            $.rename({ suffix: ".min" })
        ))
        .pipe($.size({ gzip: true, showFiles: true }))
        .pipe(gulp.dest(pkg.paths.templates + "_inlinejs"))
        .pipe($.filter("**/*.js"))
        //.pipe($.livereload());
});

// js task - minimize any distribution Javascript into the public js folder, and add our banner to it
gulp.task("js", ["js-inline"], () => {
    $.fancyLog("-> Building js");
    return gulp.src(pkg.globs.distJs)
        .pipe($.plumber({ errorHandler: onError }))
        .pipe($.if(["*.js", "!*.min.js"],
            $.newer({ dest: pkg.paths.dist.js, ext: ".min.js" }),
            $.newer({ dest: pkg.paths.dist.js })
        ))
        /* .pipe($.if(["*.js", "!*.min.js"],
            $.uglify()
        )) */
        .pipe($.if(["*.js", "!*.min.js"],
            $.rename({ suffix: ".min" })
        ))
        .pipe($.header(banner, { pkg: pkg }))
        .pipe($.size({ gzip: true, showFiles: true }))
        .pipe(gulp.dest(pkg.paths.dist.js))
        .pipe($.filter("**/*.js"))
        //.pipe($.livereload());
});

// Static Server + watching scss/html files
gulp.task('serve', ['scss'], function() {

    browserSync.init({
        server: "./"
    });

    gulp.watch("src/scss/*.scss", ['scss']);
    gulp.watch("./*.html").on('change', browserSync.reload);
    gulp.watch("./include/css/*.css").on('change', browserSync.reload);
});

//copy favicons task
gulp.task("favicons", ["favicons-generate"], () => {
    $.fancyLog("-> Copying favicon.ico");
    return gulp.src(pkg.globs.siteIcon)
        .pipe($.size({ gzip: true, showFiles: true }))
        .pipe(gulp.dest(pkg.paths.dist.base));
});

// imagemin task
gulp.task("imagemin", () => {
    return gulp.src(pkg.paths.dist.img + "**/*.{png,jpg,jpeg,gif,svg}")
        .pipe($.imagemin({
            progressive: true,
            interlaced: true,
            optimizationLevel: 7,
            svgoPlugins: [{ removeViewBox: false }],
            verbose: true,
            use: []
        }))
        .pipe(gulp.dest(pkg.paths.dist.img));
});

// Default task
gulp.task("default", ["css","mqcss", "vendorcss", "js"], () => {
    gulp.watch([pkg.paths.src.scss + "**/*.scss"], ["css", "mqcss"]);
    gulp.watch([pkg.paths.src.css + "**/*.css"], ["css", "mqcss"]);
    gulp.watch([pkg.paths.src.js + "**/*.js"], ["js"]);
});

// Production build
gulp.task("build", ["default", "imagemin"]);