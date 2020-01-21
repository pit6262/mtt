'use strict';

var gulp        		   = require('gulp'),
	concat      		   = require('gulp-concat'),
	prefixer    		   = require('gulp-autoprefixer'),
	uglify      		   = require('gulp-uglify'),
	sass        		   = require('gulp-sass'),
	sourcemaps  		   = require('gulp-sourcemaps'),
	rigger      		   = require('gulp-rigger'),
	cleanCss    		   = require('gulp-clean-css'),
	imagemin    		   = require('gulp-imagemin'),
	pngquant    		   = require('imagemin-pngquant'),
	rimraf      		   = require('rimraf'),
	replace     		   = require('gulp-replace'),
	browserSync 		   = require("browser-sync").create(),
	del 	    		   = require("del"),
	cache 	    		   = require("gulp-cache"),
	imageminJpegRecompress = require('imagemin-jpeg-recompress');


var path = {
	//папка куда складываются готовые файлы
    build: { 
        html: 'build/',
        js: 'build/js/',
        css: 'build/css/',
        img: 'build/img/',
        fonts: 'build/fonts/'
    },
    //папка откуда брать файлы
    src: { 
        html: 'src/*.html', 
        js: 'src/js/*.js', 
        style: 'src/sass/*.sass', 
        css: 'src/css/*.css', 
        img: 'src/img/**/*.*', 
        fonts: 'src/fonts/**/*.*'
    },
    //указываем после измененя каких файлов нужно действовать
    watch: { 
        html: 'src/**/*.html',
        js: 'src/js/**/*.js',
        style: 'src/sass/**/*.sass',
        css: 'src/css/**/*.css',
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*'
    },
    clean: './build'
};

var config = {
    server: {
        baseDir: "./build" //из какой папки показывать
    },
    tunnel: false,
    host: 'localhost', 
    port: 8080,
    open: true,
    notify: false,
    logPrefix: "gl"
};

// var jsFiles = [
// 	'./src/js/jquery-3.2.1.min.js',
// 	'./src/js/jquery.formstyler.min.js',
// 	'./src/js/jquery.fancybox.js',
// 	'./src/js/custom.js'
// ];


function fonts(){
	return gulp.src(path.src.fonts)
				.pipe(gulp.dest(path.build.fonts));			
}

function images(){
	return gulp.src(path.src.img)
				.pipe(cache(imagemin([
			      imagemin.gifsicle({interlaced: true}),
			      imagemin.jpegtran({progressive: true}),
			      imageminJpegRecompress({
			        loops: 5,
			        min: 65,
			        max: 70,
			        quality:'medium'
			      }),
			      imagemin.svgo({
			      	plugins: [
				      	{cleanupIDs: false},
					    {removeUselessDefs: false},
					    {removeViewBox: true},
				    ]
			      }),
			      imagemin.optipng({optimizationLevel: 3}),
			      pngquant({quality: '65-70', speed: 5})
			    ],{
			      verbose: true
			    })))
				.pipe(gulp.dest(path.build.img))
				.pipe(browserSync.reload({stream: true}));
}

function html(){
	return gulp.src(path.src.html)
				.pipe(rigger())
				.pipe(gulp.dest(path.build.html))
				.pipe(browserSync.reload({stream: true}));
}

function styles(){
	return gulp.src(path.src.style)
				.pipe(sourcemaps.init())
				.pipe(sass()) 
				.pipe(prefixer({ 
				    browsers: ['> 0.1%', 'IE 10'],
				    cascade: false
				})) 
				// .pipe(cleanCss({
				// 	level: 2
				// }))
				.pipe(gulp.dest(path.build.css))
				.pipe(browserSync.reload({stream: true}));
}

function css(){
	return gulp.src(path.src.css)
				.pipe(gulp.dest(path.build.css))
				.pipe(browserSync.reload({stream: true}));
}

function scripts(){
	return gulp.src(path.src.js) 
				.pipe(rigger()) 
				.pipe(sourcemaps.init()) 
				// .pipe(concat('all.js'))
				// .pipe(uglify()) 
				.pipe(gulp.dest(path.build.js))
				.pipe(browserSync.reload({stream: true}));
}

function watch(){
	browserSync.init(config)
	gulp.watch(path.watch.style, styles);
	gulp.watch(path.watch.css, css);
	gulp.watch(path.watch.js, scripts);
	gulp.watch(path.watch.html, html);
	gulp.watch(path.watch.fonts, fonts);
	gulp.watch(path.watch.img, images);
}

function clean(){
	return del(['build/*']);
}

gulp.task('fonts', fonts);
gulp.task('images', images);
gulp.task('html', html);
gulp.task('styles', styles);
gulp.task('css', css);
gulp.task('scripts', scripts);
gulp.task('watch', watch);

gulp.task('build', gulp.series(clean, 
						gulp.parallel(styles, css, scripts, html, images, fonts
					)));

gulp.task('dev', gulp.series('build', 'watch'));

