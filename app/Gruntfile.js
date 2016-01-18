var tplProcess = require('./build-tools/tpl-process'),
    assets = require('./build-tools/assets'),
    path = require('path'),
    fs = require("fs"),
    mkdirp = require('mkdirp'),
    mountFolder = function (connect, dir) {
        return connect.static(path.resolve(dir.toString()));
    };

module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        dist_root: 'dist',
        env: 'dev',

        clean: {
            //TODO: Original
            /*dist: '<%= dist_root %>'*/
            dist: {
                files: [
                    // static data files
                    { expand: true, src: [ '<%= dist_root %>'+'/data/*.json' ]},
                    // js
                    { expand: true, src: [ '<%= dist_root %>'+'/js/**' ]},
                    // views
                    { expand: true, src: [ '<%= dist_root %>'+'/view/**' ]},
                    // index
                    { expand: true, src: [ '<%= dist_root %>'+'/index.html' ]},
                    // css
                    { expand: true, src: [ '<%= dist_root %>'+'/css/**/*.css' ]},
                    // vendor
                    { expand: true, src: [ '<%= dist_root %>'+'/bower_components/**' ]},

                    { expand: true, src: [ '<%= dist_root %>'+'/test/**' ]},
                ]
            },
            js: {
                files: [
                    { expand: true, src: [ '<%= dist_root %>'+'/js/**' ]},
                ]
            }
        },

        copy: {
        	test: {
        		files: [
    		        { expand: true, src: [ 'test-main.js' ], dest: '<%= dist_root %>/js/' },
    		        { expand: true, src: [ 'data/*.json' ], dest: '<%= dist_root %>' },
    		        { expand: true, src: [ 'js/**' ], dest: '<%= dist_root %>' },
    		        { expand: true, src: [ 'test/**' ], dest: '<%= dist_root %>' },
    		        { expand: true, src: [ 'view/**' ], dest: '<%= dist_root %>' },
    		        { expand: true, src: [ 'index.html' ], dest: '<%= dist_root %>' },
    		        { expand: true, src: [ 'assets/**' ], dest: '<%= dist_root %>' },
    		        { expand: true, src: [ 'css/**/*.css' ], dest: '<%= dist_root %>' },
    		        { expand: true, src: [ 'bower_components/**' ], dest: '<%= dist_root %>' }
		        ]
        	},
        	
            dist: {

                files: [
                    // data
                    { expand: true, src: [ 'data/*.json' ], dest: '<%= dist_root %>' },
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
            },
            
            js: {
                files: [
                    { expand: true, src: [ 'js/**' ], dest: '<%= dist_root %>' },
                ]
            },

            production: {
                files: [
                    // data
                    { expand: true, src: [ 'data/**' ], dest: '<%= dist_root %>' },
                    // assets
                    { expand: true, src: [ 'assets/**' ], dest: '<%= dist_root %>' }
                ]
            }
        },

        /*
        sass: {
            dist: {
                files: [{
                    //expand: true,
                    src: [ 'css/main.scss' ],
                    dest: '<%= dist_root %>/static/main.css',
                    ext: '.css'
                }]
            }
        },
        */

        sass: {
            dist : {
                files: {
                    '<%= dist_root %>/static/main.css' : 'css/main.scss'
                }
            }
        },
        
        imagemin: {
            assets: {
                options: { 
                    optimizationLevel: 1
                },
                files: [{
                  expand: true,
                  src: ['assets/images/*.png'],
                  dest: '<%= dist_root %>'
                }]
            }
        },

        tslint: {
            options: {
                formatter: "prose",
                configuration: grunt.file.readJSON("tslint.json")
            },
            files: {
                src: [ '!Gruntfile.js', 'js/**/*.ts' ]
            }
        },

        watch: {
            dist: {
                files: [ 'js/localization.json', 'view/**/*.ko', 'css/**/*.scss', '!<%= dist_root %>/**',
                         'js/**/*.js', 'js/**/*.ts'],
                //files: [ 'data/**', 'js/localization.json', 'js/**/*.js',
                //         'view/**/*.ko', 'css/**/*.scss', '!<%= dist_root %>/**' ],
                tasks: [ 'build', 'templateIndex', 'preprocess:dev' ]
            },
            sass: {
            	files: ['css/**/*.scss'],
            	tasks: [ 'sass' ]
            },
            js: {
            	files: ['js/**/*.js', 'js/**/*.ts'],
            	tasks: ['clean:js', 'copy:js', 'ts:dist']
            }
        },

        // https://github.com/jrburke/r.js/blob/master/build/example.build.js
        requirejs: {
            production: {
                options: {
				    almond: true,
                    baseUrl: "dist/js",
                    mainConfigFile: "dist/js/config.js",
                    name: '../../node_modules/almond/almond',
                    findNestedDependencies: true,
                    preserveLicenseComments: false,
                    optimize: "uglify2",
                    //optimize: "none",
                    out: "dist/static/script.js"
                }
            }
        },

        ts: {
            dist : {
                src: [ "typings/tsd.d.ts", "dist/js/**/*.{d.ts,ts}" ],
                options: {
                    module: 'amd',
                    failOnTypeErrors: false,
                    sourceMaps: true
                }
            },
            test: {
            	env: 'test',
            	src: [ "typings/tsd.d.ts", "dist/js/**/*.{d.ts,ts}", "dist/test/*.{d.ts,ts}" ],
            	options: {
            		module: 'amd',
            		failOnTypeErrors: false,
            		sourceMaps: true
            	}
            }
        },

        karma: {
            unit: {
                configFile: "./karma.conf.js"
            }
        },

        // TODO: livereload
        connect: {
            production: {
                options: {
                    port: 8000,
                    base: '<%= dist_root %>',
                    host: '0.0.0.0',
                    middleware: function (connect, options) {
                        return [
                            mountFolder(connect, options.base)
                        ];
                    }
                }
            },
            dist: {
                options: {
                    port: 8000,
                    base: '<%= dist_root %>',
                    host: '0.0.0.0',
                    middleware: function (connect, options) {
                        return [
                            //tplProcess.middleware(grunt, 'dist/'),
                            mountFolder(connect, options.base)
                        ];
                    }
                }
            }
        },

        preprocess : {
            production: {
            	src : 'dist/index.html',
            	dest : 'dist/index.html',
            	options: {
            		inline: true,
            		context : {
            			BUILD: 'production'
            		}
            	},
            },
            test: {
            	src : 'dist/index.html',
            	dest : 'dist/index.html',
            	options: {
            		inline: true,
            		context : {
            			BUILD: 'test'
            		}
            	}
            },
            dev: {
            	src : 'dist/index.html',
            	dest : 'dist/index.html',
            	options: {
            		inline: true,
            		context : {
            			BUILD: 'dev'
            		}
            	},
            }
        }
    });

    grunt.registerTask('templateIndex', function () {
        var templated = tplProcess.process(grunt, process.cwd());
        grunt.file.write('dist/index.html', templated);
    });

    grunt.registerTask('assets', function () {
        var data = assets.generate(process.cwd(), 'assets');
        var assetsDir = process.cwd() + '/dist/assets';
        mkdirp.sync(assetsDir);
        fs.writeFileSync(assetsDir + '/preload.json', JSON.stringify(data));
    });

    grunt.registerTask('setProductionBuildEnv', function () {
        grunt.config('env', 'production');
    });

    grunt.registerTask('setUnitTestBuildEnv', function () {
    	grunt.config('env', 'test');
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-preprocess');
    grunt.loadNpmTasks("grunt-ts");
    grunt.loadNpmTasks('grunt-tslint');

    grunt.registerTask('build', [ 'clean:dist', 'assets', 'copy:dist', 'ts:dist', 'sass:dist' ]);

    grunt.registerTask('production', [ 'setProductionBuildEnv', 'build', 'requirejs:production', 
                                       'templateIndex', 'preprocess:production',]);

    grunt.registerTask('default', [ 'build', 'templateIndex', 'preprocess:dev', 'connect:dist',
                                    'watch:dist' ]);

    grunt.registerTask('serve-production', [ 'production', 'connect:production:keepalive' ]);

    grunt.registerTask('test', ['setUnitTestBuildEnv', 'clean:dist',
                                'assets', 'copy:test', 'ts:test', 'sass:dist',
                                'templateIndex', 'preprocess:test', 'karma' ]);
};
