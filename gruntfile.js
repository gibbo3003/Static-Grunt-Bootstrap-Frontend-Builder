'use strict';

module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    sass: {
      dist: {
        options: {
          //outputStyle: 'compressed'
          outputStyle: 'expanded'
        },
        files: {
          'dist/css/app.css': 'app/assets/style/app.scss'
        }
      }
    },

    assemble: {
      options: {
        assets: 'dist',
        data: './app/data/**/*.json',
        layoutdir: "app/views/",
        partials: ['app/views/partials/**/*.hbs'],
        helpers: ['helpers/**/*.js'],
        flatten: true
      },
      pages: {
        options: {
          layout: 'app.hbs'
        },
        files: {
          './dist/': ['app/views/pages/**/*.hbs']
        }
      },
    },

    copy: {
      main:{
        files: [
          //jquery
          {cwd: 'bower_components/jquery/dist/', src: 'jquery.min.js', dest: 'app/assets/js/vendors',  expand: true},
          //bootstrap js
          {cwd: 'bower_components/bootstrap-sass/assets/javascripts', src: 'bootstrap.min.js', dest: 'app/assets/js/vendors', expand: true},
          //bootstrap all css and mixins
          {cwd: 'bower_components/bootstrap-sass/assets/stylesheets/bootstrap', src: '**/*', dest: 'app/assets/style/bootstrap', expand: true},
          //bootstrap css base
          {cwd: 'bower_components/bootstrap-sass/assets/stylesheets', src: '_bootstrap.scss', dest: 'app/assets/style/', expand: true},
          //bootstrap fonts
          {cwd: 'bower_components/bootstrap-sass/assets/fonts', src: '**/*', dest: 'dist/fonts', expand: true},
          //angular
          {cwd: 'bower_components/angular', src: 'angular.min.js', dest: 'app/assets/js/vendors', expand: true},
          //angular messages
          {cwd: 'bower_components/angular-messages', src: 'angular-messages.min.js', dest: 'app/assets/js/vendors', expand: true},
          //angular route
          {cwd: 'bower_components/angular-route', src: 'angular-route.min.js', dest: 'app/assets/js/vendors', expand: true},
          //angular sanitize
          {cwd: 'bower_components/angular-sanitize', src: 'angular-sanitize.min.js', dest: 'app/assets/js/vendors', expand: true},
          //angular touch
          {cwd: 'bower_components/angular-touch', src: 'angular-touch.min.js', dest: 'app/assets/js/vendors', expand: true}
        ]
      }
    },

    uglify: {
      options: {
        sourceMap: false,
        mangle: false,
        compress: false,
        beautify: false
      },
      app: {
        files: {
          'dist/js/app.min.js': [
            //vendors
            'app/assets/js/vendors/jquery.min.js',
            'app/assets/js/vendors/bootstrap.min.js',
            'app/assets/js/vendors/angular.min.js',
            'app/assets/js/vendors/angular-messages.min.js',
            'app/assets/js/vendors/angular-route.min.js',
            'app/assets/js/vendors/angular-sanitize.min.js',
            'app/assets/js/vendors/angular-touch.min.js',
            //angular app
            'app/assets/js/app.js',
            //angular controllers
            //'app/assets/js/controller/controller.js',
            //angular directives
            //'app/assets/js/controller/directive.js',
            
          ]
        }
      }
    },

    imagemin: {
      png: {
        options: {
          optimizationLevel: 7
        },
        files: [
          {
            expand: true,
            cwd: 'app/assets/images',
            src: ['**/*.png'],
            dest: 'dist/images/',
            ext: '.png'
          }
        ]
      },
      jpg: {
        options: {
          progressive: true
        },
        files: [
          {
            expand: true,
            cwd: 'app/assets/images',
            src: ['**/*.jpg'],
            dest: 'dist/images/',
            ext: '.jpg'
          }
        ]
      },
      gif: {
        options: {
          interlaced: true
        },
        files: [{
            expand: true,
            cwd: 'app/assets/images',
            src: ['**/*.gif'],
            dest: 'dist/images/',
            ext: '.gif'
        }]
      }
    },
    connect: {
      server: {
        options: {
          livereload: true,
          hostname: '0.0.0.0',
          base: 'dist/',
          port: 9000,
          open: 'http://localhost:<%= connect.server.options.port %>',
          appName: 'open'
        }
      }
    },

    // Make sure there are no obvious mistakes
    jshint: {
        options: {
            jshintrc: '.jshintrc',
            reporter: require('jshint-stylish'),
            ignores: ['app/assets/js/vendors/*.js']
        },
        all: {
            src: [
                'Gruntfile.js',
                'app/assets/js/{,*/}*.js'
            ]
        }
    },

    watch: {
      sass: {
        files: ['app/assets/style/app.scss','app/assets/style/**', 'app/assets/style/*/**'],
        tasks: ['sass'],
        options: {
          livereload: true,
        }
      },
      assemble: {
        files: ['app/views/**/*.hbs', 'app/views/**/**/*.hbs', 'data/**/*.json'],
        tasks: ['assemble'],
        options: {
          livereload: true,
        }
      },
      uglify: {
        files: ['app/assets/js/*/**','app/assets/js/**'],
        tasks: ['newer:jshint:all', 'uglify'],
        options: {
          livereload: true,
        }
      },
      imagemin: {
        files: 'app/assets/images/*.{png,jpg,gif}',
        tasks: ['newer:imagemin'],
        options: {
          livereload: true,
        }
      }
    }
  });

  grunt.loadNpmTasks('assemble');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-newer');
  grunt.loadNpmTasks('grunt-sass');

  //initial setup to copy bower files
  grunt.registerTask('setup', [
    'assemble',
    'copy'
  ]);

  grunt.registerTask('build', [
    'sass',
    'assemble',
    'copy',
    'imagemin',
    'uglify'
  ]);

  grunt.registerTask('default', [
    'build',
    'connect',
    'watch'
  ]);
};