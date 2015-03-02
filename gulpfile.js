/**
 * Created by ychen on 10/31/14.
 */

var gulp = require('gulp');
var to5 = require('gulp-6to5');
var sass = require('gulp-ruby-sass');
var mocha = require('gulp-mocha');
var regenerator = require('gulp-regenerator');
var yargs = require('yargs');
var plumber = require('gulp-plumber');
var debug = require('gulp-debug');
var rename = require('gulp-rename');
var vulcanize = require('gulp-vulcanize');
var uglify = require('gulp-uglify');
var amdOptimize = require("amd-optimize");
var concat = require('gulp-concat');
var order = require('gulp-order');
var livereload = require('gulp-livereload');
var arrayFromPoly = require('array.from');


const BUILD_DEST_DIR = 'build';
const WEB_PATH = 'web';
const XAVIER_PATH = "../XavierPlay/public/";
const SCRIPT_BASE_URL = "app/es5";
const ICON_SET_SVG_PATH = "app/icons/svg";

gulp.task('refresh', ['6to5', 'es5', 'sass']);

gulp.task('6to5', function () {

    var sourcemaps = require("gulp-sourcemaps");

    return gulp.src(['app/es6/**/*.js', '!app/es6/**/*.es5.js'])
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(regenerator({
            includeRuntime: false
        }))
        .pipe(to5({
            experimental: true,
            modules: "amd"
        }))
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest('app/es5/'));
});

gulp.task('es5', function () {
    return gulp.src(['app/es6/**/*.es5.js'])
        .pipe(plumber())
        .pipe(rename(function(path){
            path.basename = path.basename.replace(/.es5/,"");
        }))
        .pipe(gulp.dest('app/es5/'));
});

//gulp.task('reload', function () {
//    return
//});

gulp.task('sass', function () {
    gulp.src('sass/**/*.scss')
        .pipe(plumber())
        .pipe(sass({sourcemap: false, compass: true}))
        .on('error', function (err) { console.log(err.message); })
        .pipe(gulp.dest('stylesheets'));
});


gulp.task('icon-set', function () {

    var svgstore = require('gulp-svgstore');
    var svgmin = require('gulp-svgmin');
    var inject = require('gulp-inject');
    var replace = require('gulp-replace'); //This is an hack since polymer/icon doesn't support symbol mode
    // So the viewbox size must be in sync with icon-set.html's iconSize

    var svgs =  gulp.src(ICON_SET_SVG_PATH+'/*.svg')
        .pipe(svgmin())
        .pipe(svgstore({ fileName: 'icons.svg', prefix: 'icon-', inlineSvg:true }))

    function fileContents (filePath, file) {
        return file.contents.toString('utf8')
    }
    return gulp
        .src(ICON_SET_SVG_PATH+'/icon-set.html')
        .pipe(inject(svgs, { transform: fileContents }))
        .pipe(replace(/symbol/g, "g"))
        .pipe(gulp.dest(ICON_SET_SVG_PATH));
});

//-----------------------------------------------------------------------------------------------
//
//                                        UTILITIES
//
//-----------------------------------------------------------------------------------------------

gulp.task("imageList", function(){

    var i=0;
    gulp.src('web/images/samples/src/*')
        .pipe(plumber())
        .pipe(rename(function(path){
            path.basename = (i++);
        }))
        .pipe(gulp.dest('web/images/samples/Cuties/'));
});

//gulp.task("imageMeta", function(){
//
//    var aspectRatioList = [];
//
//    function makeChange() {
//        // you're going to receive Vinyl files as chunks
//        function transform(file, cb) {
//            // read and modify file contents
//            file.contents = new Buffer(String(file.contents) + ' some modified content');
//
//            console.log(aspectRatioList);
//
//            // if there was some error, just pass as the first parameter here
//            cb(null, file);
//        }
//
//        // returning the map will cause your transform function to be called
//        // for each one of the chunks (files) you receive. And when this stream
//        // receives a 'end' signal, it will end as well.
//        //
//        // Additionally, you want to require the `event-stream` somewhere else.
//        return eventStream.map(transform);
//    }
//
//    gulp.src('web/images/samples/Cuties/*')
//    .pipe(gm(function(gmfile, done){
//
//       gmfile.size(function(err, sizes){
//
//           aspectRatioList.push(sizes.width/sizes.height);
//
//           done(null, gmfile);
//       });
//    }))
//    .pipe(makeChange());
//});


//-----------------------------------------------------------------------------------------------
//
//                                        BUILD
//
//-----------------------------------------------------------------------------------------------

gulp.task("vulcanize", function(){

    return gulp.src('web/index.html')
        .pipe(vulcanize({
            dest: BUILD_DEST_DIR,
            csp: true,
            inline: true
        }))
        .pipe(gulp.dest(BUILD_DEST_DIR));
});

gulp.task("optimize", ['vulcanize'], function(){

    var paths = require("./lib/lib");

    return gulp.src(BUILD_DEST_DIR +'/index.js')
        .pipe(amdOptimize('index', {
            paths: paths,
            baseUrl: SCRIPT_BASE_URL
        }))
        .pipe(order([
            "index.js"
        ]))
        .pipe(concat("index.js"))
        .pipe(uglify())
        .pipe(gulp.dest(BUILD_DEST_DIR));
});

gulp.task("copy_to_xavier", ['optimize'], function(){

    return gulp.src([BUILD_DEST_DIR+'/index.js', BUILD_DEST_DIR+'/index.html'], {"base": "."})
        .pipe(gulp.dest(XAVIER_PATH));
});

gulp.task('build', ['vulcanize', 'optimize', 'copy_to_xavier']);

//-----------------------------------------------------------------------------------------------
//
//                                        TEST
//
//-----------------------------------------------------------------------------------------------

gulp.task('test', function () {
    var testType = function(){return yargs.argv.functional ? "functional" : "unit"};
    return gulp.src('test/'+ testType() +'/**/*.spec.js', {read: false})
        .pipe(mocha({reporter: 'spec', grep: yargs.argv.grep}));
});

//-----------------------------------------------------------------------------------------------
//
//                                        WATCH
//
//-----------------------------------------------------------------------------------------------

gulp.task('server', function(next) {
    var connect = require('connect'),
        serveStatic = require('serve-static'),
        server = connect();

    server.use(serveStatic(".")).listen(process.env.PORT || 9090, next);
});

// Rerun the task when a file changes
gulp.task('watch', ['server'], function() {

    var server = livereload();
    gulp.watch([WEB_PATH + '/**', "app/es5/**/*.js"]).on('change', server.changed);

    var watcher = gulp.watch(['app/es6/**/*.js', 'app/es6/*.js'], ['6to5', 'es5']);
    watcher.on('change', function(event) {
        console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });


    var stylesheetWatcher = gulp.watch('sass/**/*.scss', ['sass']);
    stylesheetWatcher.on('change', function(event) {
        console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });
});

