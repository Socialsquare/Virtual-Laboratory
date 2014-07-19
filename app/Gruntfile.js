var proxy = require('grunt-connect-proxy/lib/utils'),
    tplProcess = require('./build-tools/tpl-process'),
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
                    // data
                    { expand: true, src: [ 'data/**' ], dest: '<%= dist_root %>' },
                    // localization
                    { expand: true, src: [ 'js/localization.json' ], dest: '<%= dist_root %>' },
                    // js
                    { expand: true, src: [ 'js/**' ], dest: '<%= dist_root %>' },
                    // views
                    { expand: true, src: [ 'view/**' ], dest: '<%= dist_root %>' },
                    // index
                    { expand: true, src: [ 'index.html' ], dest: '<%= dist_root %>' },
                    // assets
                    { expand: true, src: [ 'assets/**' ], dest: '<%= dist_root %>' },
                    // css
                    { expand: true, src: [ 'css/**/*.css' ], dest: '<%= dist_root %>' },
                    // vendor
                    { expand: true, src: [ 'bower_components/**' ], dest: '<%= dist_root %>' }
                ]
            }
        },

        sass: {
            dist: {
                files: [{
                    expand: true,
                    src: [ 'css/main.scss' ],
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
                files: [ 'data/**', 'js/localization.json', 'js/**/*.js', 'view/**/*.ko', 'css/**/*.scss', '!<%= dist_root %>/**' ],
                tasks: [ 'build' ]
            }
        },

        requirejs: {
            compile: {
                options: {
                    baseUrl: "js",
                    mainConfigFile: "js/config.js",
                    name: '../node_modules/almond/almond',
                    mainConfigFile: 'js/config.js',
                    findNestedDependencies: true,
                    preserveLicenseComments: false,
                    out: "dist/script.js"
                }
            }
        },

        // TODO: livereload
        connect: {
            dist: {
                options: {
                    port: 8000,
                    base: '<%= dist_root %>',
                    host: '0.0.0.0',
                    middleware: function (connect, options) {
                        return [
                            tplProcess.middleware(grunt, process.cwd()),
                            mountFolder(connect, options.base),
                            proxy.proxyRequest
                        ];
                    }
                },
                proxies: [{
                    context: '/',
                    host: 'www.virtueltlaboratorium.dk',
                    changeOrigin: true,
                }]
            }
        },

        shell: {
            preload: {
                options: { stdout: true },
                command: 'utils/gen-preload-files.sh'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-connect-proxy');
    grunt.loadNpmTasks('grunt-shell');

    // TODO: enable jshint when smellz is cleaned
    grunt.registerTask('build', [ 'clean:dist', 'shell:preload', 'copy:dist', 'sass:dist' ]);

    grunt.registerTask('default', [ 'build', 'configureProxies:dist', 'connect:dist', 'watch:dist' ]);
};
