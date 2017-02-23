// Copyright (C) 1976-2016, Samtec
// All rights are reserved.
// Samtec proprietary information: the enclosed materials contain proprietary information
// of Samtec and shall not be disclosed in whole or in any part to any third party
// or used by any person for any purpose, without the express written consent of Samtec.
// Duplication of any portion of these materials shall include this legend.

var gulp = require('gulp');
var bower = require('gulp-bower');
var sequence = require('gulp-sequence').use(gulp);
var clean = require('gulp-clean');
var less = require('gulp-less');
var concatCss = require('gulp-concat-css');
var concatJs = require('gulp-concat');
var minifyCss = require('gulp-cssnano');
var uglify = require('gulp-uglify');
var rev = require('gulp-rev');
var inject = require('gulp-inject');
var notify = require('gulp-notify');
var templateCache = require('gulp-angular-templatecache');
var replace = require('gulp-replace');
var dateFormat = require('dateformat');

// Source folder - where all website components live during development.
// var srcFolder = 'src';
var srcFolderRoot = './src';

// Distribution folder - where all website components are written for deployment.
var distFolder = '';
var distFolderRoot = './';

var indexSrc = srcFolderRoot + '/index.html';
var indexDest = distFolderRoot + '/index.html';

// Only glob specific vendor JavaScript files
var vendorJs = [
    './bower_components/jquery/dist/jquery.min.js',
    './bower_components/bootstrap/dist/js/bootstrap.min.js',
    './bower_components/angular/angular.min.js',
    './bower_components/angular-route/angular-route.min.js',
    './bower_components/angular-sanitize/angular-sanitize.min.js',
    './bower_components/angular-bootstrap/ui-bootstrap.min.js',
    './bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
    './bower_components/angular-animate/angular-animate.min.js',
    './bower_components/angular-toastr/dist/angular-toastr.min.js',
    './bower_components/angular-toastr/dist/angular-toastr.tpls.min.js',
    './bower_components/lodash/dist/lodash.min.js',
    './bower_components/moment/min/moment.min.js',
    './bower_components/jsoneditor/dist/jsoneditor.js',
    './bower_components/ng-jsoneditor/ng-jsoneditor.js',    
    './bower_components/ag-grid/dist/ag-grid.min.js',   
    './bower_components/aws-sdk/dist/aws-sdk.min.js'
];

// Only glob specific vendor style sheet files
var vendorCss = [
    './bower_components/bootstrap/dist/css/bootstrap.css',
    './bower_components/angular-toastr/dist/angular-toastr.css',
    './bower_components/jsoneditor/dist/jsoneditor.css',    
];

// Glob ALL application JavaScript files
var applicationJs = [
    srcFolderRoot + '/app/**/*.js'
];

// Glob ALL application style sheet files
var applicationCss = [    
    srcFolderRoot + '/assets/app.css',
    srcFolderRoot + '/assets/theme-samtec.css'
];

// Glob ALL application LESS files
var applicationLess = [
    srcFolderRoot + '/assets/**/*.less'
];

// Glob ALL image files
// var images = [
//     srcFolderRoot + '/assets/**/*.png'
// ];

// Configuration for injecting CSS and JS files into Index.html
// Remove the leading path i.e. './dist/xxxx' --> 'xxxx'
// Don't add leading slash i.e. '/xxxx' --> 'xxxx'
// Remove marker (comment) tags in Index.html i.e. remove '<!--app:css-->  <!--endinject-->
var injectconfig = {
    app: { name: 'app', ignorePath: distFolder, addRootSlash: false, removeTags: true },
    vendor: { name: 'vendor', ignorePath: distFolder, addRootSlash: false, removeTags: true }
};

// Configuration for injecting CSS and JS files into Index.html -- DEVELOPMENT
// Remove the leading path i.e. './dist/xxxx' --> 'xxxx'
// Don't add leading slash i.e. '/xxxx' --> 'xxxx'
// Remove marker (comment) tags in Index.html i.e. remove '<!--app:css-->  <!--endinject-->
var injectdevconfig = {
    app: { name: 'app', addRootSlash: false, removeTags: true, relative: true},
    vendor: { name: 'vendor', addRootSlash: false, removeTags: true, relative: true }
};

// Restore all Bower packages
gulp.task('bower', function () {
    return bower();
});

// Delete the app-*.* artifacts. 
gulp.task('clean-app', function () {
    return gulp.src(distFolder + 'app-*.*', {read:false})
        .pipe(clean());
});

// Delete the vendor-*.* artifacts. 
gulp.task('clean-vendor', function () {
    return gulp.src(distFolder + 'vendor-*.*', {read:false})
        .pipe(clean());
});

// Copy the index.html from source folder to distribution folder. 
gulp.task('copy', function () {
    return gulp.src(indexSrc)
        .pipe(gulp.dest(distFolder));
});

// Stamp the build date/version into the index.html
gulp.task('version', function(){   
    var now = new Date();
   
    var build = dateFormat(now, 'yyyy.mm.dd.HHMM');

    return gulp.src(indexDest)
        .pipe(replace('X.X.X.X', build))
        .pipe(gulp.dest(distFolderRoot));
});

// Concatenate, minify, and cache-bust the application CSS files.
gulp.task('appcss', function () {
    return gulp.src(applicationCss)
        .pipe(concatCss('app.css'))
        //.pipe(minifyCss())
        .pipe(rev())
        .pipe(gulp.dest(distFolder));
});

// Concatenate, minify, and cache-bust the vendor CSS files
gulp.task('vendorcss', function () {
    return gulp.src(vendorCss)
        .pipe(concatCss('vendor.css'))
        //.pipe(minifyCss())
        .pipe(rev())
        .pipe(gulp.dest(distFolder));
});

// Concatenate, minify, and cache-bust the application JavaScript files
gulp.task('appjs', function () {
    return gulp.src(applicationJs)
        .pipe(concatJs('app.js'))
        //.pipe(uglify())
        .on('error', notify.onError("Error: <%= error.message %>"))
        .pipe(rev())
        .pipe(gulp.dest(distFolder));
});

// Concatenate and cache-bust the vendor JavaScript files
// (Do not minify.  Some vendor JS files do not do well under minification.  
// Use existing min files that have been "tuned" by the vendor.)
gulp.task('vendorjs', function () {
    return gulp.src(vendorJs)
        .pipe(concatJs('vendor.js'))
        .pipe(rev())
        .pipe(gulp.dest(distFolder));
});

// Inject the "rev'd" CSS and JS files in the Index.html at the appropriate tags
gulp.task('index', function () {
    return gulp.src(indexDest)
        .pipe(inject(gulp.src(distFolderRoot + '/app-*.css'), injectconfig.app))
        .pipe(inject(gulp.src(distFolderRoot + '/vendor-*.css'), injectconfig.vendor))
        .pipe(inject(gulp.src(distFolderRoot + '/app-*.js'), injectconfig.app))
        .pipe(inject(gulp.src(distFolderRoot + '/vendor-*.js'), injectconfig.vendor))
        .pipe(gulp.dest(distFolderRoot));
});

// Inject the development CSS and JS files in the Index.html at the appropriate tags
gulp.task('indexdev', function () {
    gulp.src(indexDest)
        .pipe(inject(gulp.src(applicationCss), injectdevconfig.app))
        .pipe(inject(gulp.src(vendorCss), injectdevconfig.vendor))
        .pipe(inject(gulp.src(applicationJs), injectdevconfig.app))
        .pipe(inject(gulp.src(vendorJs), injectdevconfig.vendor))
        .pipe(gulp.dest(distFolderRoot));
});

// Convert application LESS files to corresponding CSS files
gulp.task('less', function() {
    return gulp.src(applicationLess)
        .pipe(less()) 
        .pipe(gulp.dest(srcFolderRoot + '/assets/'));   
});

// Load all templates into a template cache
gulp.task('html', function () {
  return gulp.src('src/app/**/*.html')
    .pipe(templateCache('templates.js', {module:'Samtec.Anduin.Installer.Web'}))
    .pipe(gulp.dest(srcFolderRoot + '/app'));
});

// Watch for changes in the application JS files.  
gulp.task('watch', function(){    
    gulp.watch(applicationLess, ['less']);
});


// The "deploy" task.  Process CSS and JS files, in proper sequence, and copy results to distribution folder.
gulp.task('deploy', sequence('bower',
                             'clean-app',
                             'clean-vendor',
                             'less',
                             'html',
                             'copy',
                             'version',
                             ['appcss', 'vendorcss', 'appjs', 'vendorjs'],
                             'index'));
                              
gulp.task('default', sequence('clean-app',
                              'clean-vendor',
                              'less',
                              'html',
                              'copy',
                              'version',
                              'indexdev'));