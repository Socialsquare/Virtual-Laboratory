// Karma configuration
// Generated on Tue Jul 08 2014 23:06:01 GMT+0200 (CEST)

module.exports = function(config) {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        baseUrl: '',


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine', 'requirejs'],


        // list of files / patterns to load in the browser
        files: [
            'test/mock/indexeddb.js',
            'test-main.js',
            { pattern: 'dist/test/*.{js,js.map}', included: false },
            { pattern: 'dist/js/**/*.{js,js.map}', included: false },
            { pattern: 'bower_components/**/*.js', included: false },
            { pattern: 'data/**', included: false },
            { pattern: 'test-data/**', included: false }
        ],


        // list of files to exclude
        exclude: [

        ],


        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        //preprocessors: {
        //    '**/*.ts': 'typescript'
        //},

/*        typescriptPreprocessor: {
            // options passed to the typescript compiler
            options: {
                sourceRoot: 'dist/js/',
                sourceMap: true, // (optional) Generates corresponding .map file.
                mapRoot: 'dist/js/',
                // target: 'ES5', // (optional) Specify ECMAScript target version: 'ES3' (default), or 'ES5'
                module: 'amd', // (optional) Specify module code generation: 'commonjs' or 'amd'
                // noImplicitAny: true, // (optional) Warn on expressions and declarations with an implied 'any' type.
                // noResolve: true, // (optional) Skip resolution and preprocessing.
                // removeComments: true // (optional) Do not emit comments to output.

            },
            typings: [
                'typings/tsd.d.ts'
            ],
        },*/

        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress'],


        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_DEBUG,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: false,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher

        browsers: ['PhantomJS'],

        phantomjsLauncher: {
            // Have phantomjs exit if a ResourceError is encountered (useful if karma exits without killing phantom)
            exitOnResourceError: true
        },

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: true
    });
};
