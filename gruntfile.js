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
      jquery: {
        cwd: 'bower_components/jquery/dist/',
        src: 'jquery.min.js',
        dest: 'app/assets/js',    // destination folder
        expand: true
      },
      bootstrap: {
        cwd: 'bower_components/bootstrap-sass/assets/javascripts',
        src: 'bootstrap.min.js',
        dest: 'app/assets/js',    // destination folder
        expand: true
      },
      bootstrap_all: {
        cwd: 'bower_components/bootstrap-sass/assets/stylesheets/bootstrap',
        src: '**/*',
        dest: 'app/assets/style/bootstrap',    // destination folder
        expand: true
      },
      bootstrap_css: {
        cwd: 'bower_components/bootstrap-sass/assets/stylesheets',
        src: '_bootstrap.scss',
        dest: 'app/assets/style/',    // destination folder
        expand: true
      },
      bootstrap_fonts: {
        cwd: 'bower_components/bootstrap-sass/assets/fonts',
        src: '**/*',
        dest: 'dist/fonts',    // destination folder
        expand: true
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
            'app/assets/js/jquery.min.js',
            'app/assets/js/bootstrap.min.js',
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
    /*jsObfuscate: {
      test: {
        options: {
          concurrency: 2,
          keepLinefeeds: false,
          keepIndentations: false,
          encodeStrings: true,
          encodeNumbers: true,
          moveStrings: true,
          replaceNames: true,
          variableExclusions: [ '^_get_', '^_set_', '^_mtd_' ]
        },
        files: {
          'theme/scripts/main.min.js': [
            'theme/scripts/main.js'
          ]
        }
      }
    },*/
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
        files: ['app/views/js/**'],
        tasks: ['jsObfuscate', 'uglify' ],
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
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('js-obfuscator');
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
    //'jsObfuscate',
    'uglify'
  ]);

  grunt.registerTask('default', [
    'build',
    'connect',
    'watch'
  ]);
}