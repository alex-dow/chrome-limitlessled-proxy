module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-watch');

  var browserifyOptions = {
    browserifyOptions: {
      debug: true
    }
  };

  var browserifyTasks = {
    options: browserifyOptions,
    app: {
      src: './src/app/index.js',
      dest: './extension/build/app.js'
    },
    background: {
      src: './src/background/index.js',
      dest: './extension/build/background.js'
    }
  };

  grunt.initConfig({
    manifest: grunt.file.readJSON('./extension/manifest.json'),
    browserify: browserifyTasks,
    clean: {
      build: ['extension/build']
    },
    sass: {
      options: {
        sourceMap: true
      },
      dist: {
        files: {
          './extension/build/main.css': './sass/main.scss'
        }
      }
    },
    watch: {
      js: {
        files: ['src/**/*.js'],
        tasks: ['browserify']
      },
      sass: {
        files: ['sass/**/*.scss'],
        tasks: ['sass']
      }
    }
  });

  grunt.registerTask('default', [
      'clean',
      'sass',
      'browserify:app',
      'browserify:background'
  ]);
}
