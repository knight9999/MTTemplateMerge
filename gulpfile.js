var gulp = require('gulp');
var typescript = require('gulp-typescript');
var concat = require('gulp-concat');
var del = require('del');
var zip = require('gulp-zip');
var merge = require('merge-stream');
var fs = require('fs');

var typescriptProject = typescript.createProject({
  target: "ES5",
  removeComments: true,
        sortOutput: true
    });

gulp.task('default' , function() {
  console.log("");
  console.log("===========================================");
  console.log("");
  console.log("gulp compile_chrome : Compile ts files to dist/chrome directory.");
  console.log("gulp copy_chrome : Copy resource files (html,js,css,etc.) to dist/chrome directory.");
  console.log("gulp build_chrome : Compile + Copy");
  console.log("gulp serve_chrome : Watch resource file and ts files.");
  console.log("gulp clean_chrome : Clean dist directory.");
  console.log("gulp release_chrome : Create zip file.");
  console.log("");
  console.log("gulp compile_windows : Compile ts files to dist/windows directory.");
  console.log("gulp copy_windows : Copy resource files (html,js,css,etc.) to dist/windows directory.");
  console.log("gulp build_windows : Compile + Copy");
  console.log("===========================================");
  console.log("");
} );


gulp.task ('clean_chrome', function() {
  del.sync( [ 'dist/chrome/**' , '!dist/chrome' , '!dist/chrome/.gitkeep' ] );
});

gulp.task ('clean_windows', function() {
  del.sync( [ 'dist/windows/**' , '!dist/windows' , '!dist/windows/.gitkeep' ] );
});


gulp.task ('copy_chrome', function() {
  var common = gulp.src( ['src/common/**'] , {base: 'src/common'} ).pipe( gulp.dest( 'dist/chrome' ) );
  var chrome = gulp.src( ['src/chrome/**'] , {base: 'src/chrome'} ).pipe( gulp.dest( 'dist/chrome' ) );
  return merge(common, chrome);
});

gulp.task ('copy_windows', function() {
  var common = gulp.src( ['src/common/**'] , {base: 'src/common'} ).pipe( gulp.dest( 'dist/windows' ) );
  var win = gulp.src( ['src/windows/**'] , {base: 'src/windows'} ).pipe( gulp.dest( 'dist/windows' ) );
  return merge(common, win);
});

gulp.task('compile_chrome', function() {
  return gulp.src(['src/ts/**/*.ts'])
      .pipe(typescript(typescriptProject))
//      .pipe(typescript(typescriptProject, {referencedFrom: ['Main.ts']}))
      .js
      .pipe(concat("main.js"))
      .pipe(gulp.dest('dist/chrome/js/'));
});

gulp.task('compile_windows', function() {
  return gulp.src(['src/ts/**/*.ts'])
      .pipe(typescript(typescriptProject))
//      .pipe(typescript(typescriptProject, {referencedFrom: ['Main.ts']}))
      .js
      .pipe(concat("main.js"))
      .pipe(gulp.dest('dist/windows/js/'));
});

gulp.task('build_chrome', ['copy_chrome', 'compile_chrome'], function() {
});

gulp.task('build_windows', ['copy_windows','compile_windows'], function() {
});

gulp.task('serve_chrome', function() {
  gulp.watch('src/ts/**/*.ts', [ 'compile_chrome']);
  gulp.watch('src/common/**', [ 'copy_chrome'] );
  gulp.watch('src/chrome/**', [ 'copy_chrome'] );
});

gulp.task('release_chrome', ['clean_chrome','copy_chrome','compile_chrome'], function() {
  return gulp.src('dist/chrome/*' , {base: 'dist/chrome'}).pipe( zip('MTTemplateMerge.zip') ).pipe(gulp.dest('release'));
});


gulp.task('deploy_windows', function() {
  var config = fs.readFileSync("gulp_config.json","utf8");
//  console.log( config );
  var json = JSON.parse(config);
  var windows_deploy_path = json.windows_deploy_path;
//  console.log(windows_deploy_path);
  return gulp.src( ['dist/windows/**'] , { base: 'dist/windows'} ).pipe( gulp.dest( windows_deploy_path ) );
});
