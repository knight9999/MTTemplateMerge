var gulp = require('gulp');
var typescript = require('gulp-typescript');
var concat = require('gulp-concat');
var del = require('del');
var zip = require('gulp-zip');
var merge = require('merge-stream');

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
  console.log("gulp serve_chrome : Watch resource file and ts files.");
  console.log("gulp clean_chrome : Clean dist directory.");
  console.log("gulp release_chrome : Create zip file.");
  console.log("");
  console.log("===========================================");
  console.log("");
} );

// gulp compile_chrome
// gulp copy_chrome
// gulp clean_chrome
// gulp build_chrome (compile + copy)
// gulp release_chrome




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

gulp.task('serve_chrome', function() {
  gulp.watch('src/ts/**/*.ts', [ 'compile_chrome']);
  gulp.watch('src/common/**', [ 'copy_chrome'] );
  gulp.watch('src/chrome/**', [ 'copy_chrome'] );
});

gulp.task('releas_chrome', ['clean_chrome','copy_chrome','compile_chrome'], function() {
  return gulp.src('dist/chrome/*' , {base: 'dist/chrome'}).pipe( zip('MTTemplateMerge.zip') ).pipe(gulp.dest('release'));
});
