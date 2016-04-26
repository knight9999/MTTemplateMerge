var gulp = require('gulp');
var typescript = require('gulp-typescript');
var concat = require('gulp-concat');
var del = require('del');
var zip = require('gulp-zip');

var typescriptProject = typescript.createProject({
  target: "ES5",
  removeComments: true,
        sortOutput: true
    });

gulp.task('default' , function() {
  console.log("");
  console.log("===========================================");
  console.log("");
  console.log("gulp resource : Copy resource files (html,js,css,etc.) to dist directory.");
  console.log("gulp compile : Compile ts files to dist directory.");
  console.log("gulp serve : Watch resource file and ts files."); 
  console.log("gulp clean : Clean dist directory.");
  console.log("gulp release : Create zip file.");
  console.log("");
  console.log("===========================================");
  console.log("");
} );

gulp.task ('clean', function() {
  del.sync( [ 'dist/**' , '!dist' , '!dist/.gitkeep' ] );
});

gulp.task ('resource', function() {
  return gulp.src( ['src/res/**'] , {base: 'src/res'} ).pipe( gulp.dest( 'dist' ) );
}); 


gulp.task('compile', function() { 
  return gulp.src(['src/ts/**/*.ts'])
      .pipe(typescript(typescriptProject))
//      .pipe(typescript(typescriptProject, {referencedFrom: ['Main.ts']}))
      .js
      .pipe(concat("main.js"))
      .pipe(gulp.dest('dist/js/'));
});

gulp.task('serve', function() {
  gulp.watch('src/ts/**/*.ts', [ 'compile']);  
  gulp.watch('src/res/**', [ 'resource'] );
});

gulp.task('release', ['clean','resource','compile'], function() {
  return gulp.src('dist/*' , {base: 'dist'}).pipe( zip('MTTemplateMerge.zip') ).pipe(gulp.dest('release'));
});

