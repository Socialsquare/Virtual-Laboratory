var tplProcess = require('./build-tools/tpl-process'),
    path = require('path'),
    mountFolder = function (connect, dir) {
        return connect.static(path.resolve(dir.toString()));
    };


module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        dist_root: 'dist',

        clean: {
            dist: '<%= dist_root %>'
        },

        copy: {
            dist: {
                files: [
                    // js
                    { expand: true, src: [ 'js/**' ], dest: '<%= dist_root %>' },
                    // views
                    { expand: true, src: [ 'view/**' ], dest: '<%= dist_root %>' },
                    // index
                    { expand: true, src: [ 'index.html' ], dest: '<%= dist_root %>',
                      options: {
                          process: tplProcess.process(grunt, '<%= dist_root %>')
                      } },
                    // images
                    { expand: true, src: [ 'img/**' ], dest: '<%= dist_root %>' },
                    // videos
                    { expand: true, src: [ 'videos/**' ], dest: '<%= dist_root %>' },
                    // vendor
                    { expand: true, flatten: true, cwd: 'bower_components',
                      src: [ '**/*.js' ], dest: '<%= dist_root %>/vendor' }
                ]
            }
        },

        sass: {
            dist: {
                files: [{
                    expand: true,
                    src: [ 'css/*.scss' ],
                    dest: '<%= dist_root %>',
                    ext: '.css'
                }]
            }
        },

        jshint: {
            dist: [ 'Gruntfile.js', 'js/**/*.js', '!js/libs/**/*' ],
        },

        watch: {
            dist: {
                files: [ 'js/**/*.js', '!<%= dist_root %>/**' ],
                tasks: [ 'build' ]
            }
        },

        // TODO: livereload
        connect: {
            dist: {
                options: {
                    port: 8000,
                    base: '<%= dist_root %>',
                    middleware: function (connect, options) {
                        return [
                            tplProcess.middleware(grunt, '<%= dist_root %>'), // TODO: fix
                            mountFolder(connect, '.tmp'),
                            mountFolder(connect, options.base)
                        ];
                    }
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');

    // TODO: enable jshint when smellz is cleaned
    grunt.registerTask('build', [ 'clean:dist', 'copy:dist', 'sass:dist' ]);

    grunt.registerTask('default', [ 'build', 'connect:dist', 'watch:dist' ]);
};
