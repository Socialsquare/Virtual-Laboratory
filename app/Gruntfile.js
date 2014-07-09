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
                    // index
                    { expand: true, src: [ 'index.html' ], dest: '<%= dist_root %>' },
                    // js
                    { expand: true, src: [ 'js/**' ], dest: '<%= dist_root %>' },
                    // templates
                    { expand: true, src: [ 'templates/**' ], dest: '<%= dist_root %>' },
                    // images
                    { expand: true, src: [ 'img/**' ], dest: '<%= dist_root %>' },
                    // videos
                    { expand: true, src: [ 'videos/**' ], dest: '<%= dist_root %>' },
                    // vendor
                    { expand: true, flatten: true, cwd: 'bower_components', src: [ '**/*.js' ], dest: '<%= dist_root %>/vendor' }
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
            all: [ 'Gruntfile.js', 'js/**/*.js', '!js/libs/**/*' ]
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.registerTask('build', [ 'clean:dist', 'copy:dist', 'sass:dist' ]);

    grunt.registerTask('default', [ 'jshint', 'build' ]);
};
