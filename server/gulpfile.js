let gulp = require('gulp');
let ts = require('gulp-typescript');
let del = require('del')
let source = './src';
let destination = './dist';
let tsProject = ts.createProject('tsconfig.json');


gulp.task('clean', () => {
  return del(destination + '/**', {force: true})
})

gulp.task('graphql', () => {
  return gulp.src(source + '/**/*.graphql')
      .pipe(gulp.dest(destination))
});

gulp.task('permission', () => {
  return gulp.src('./**/*.pem')
      .pipe(gulp.dest(destination))
})

gulp.task('compile', () => {
  let tsResult = gulp.src("./src/**/*.ts")
      .pipe(tsProject())
  return tsResult.js.pipe(gulp.dest(destination))
})

gulp.task('build', gulp.series('clean', 'permission', 'graphql', 'compile'))