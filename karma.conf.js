module.exports = function(config) {
    config.set({
        basePath: '',
        frameworks: ['mocha', 'requirejs'],

        // list of files to include
        files: [
            //---------- LIB ----------//
            {pattern: 'node_modules/mutation-js/mutation.js', included: false},
            {pattern: 'node_modules/mutation-js/lodash.mutation.js', included: false},
            {pattern: 'node_modules/chai/chai.js', included: false},
            {pattern: 'node_modules/mocha/mocha.js', included: false},
            {pattern: 'node_modules/sinon/pkg/sinon.js', included: false},
            {pattern: 'node_modules/backbone/backbone.js', included: false},
            {pattern: 'node_modules/jquery/dist/jquery.js', included: false},
            {pattern: 'node_modules/functional-advice/advice.js', included: false},
            {pattern: 'node_modules/underscore/underscore.js', included: false},
            {pattern: 'bower_components/lodash/dist/lodash.js', included: false},

            // Files
            {pattern: 'backbone-advicefactory.js', included:false },

            //Tests
            {pattern: 'test/advicefactory.test.js', included: false },

            //Runner
            {pattern: 'test/test-main.js', included: true }
        ],

        // list of files to exclude
        exclude: [],

        reporters: ['progress', 'coverage'],

        preprocessors: {
            'backbone-advicefactory.js': ['coverage']
        },

        coverageReporter: {
            dir: 'coverage',
            subdir: function(browser) {
                // normalization process to keep a consistent browser name across different OS
                return browser.toLowerCase().split(/[ /-]/)[0];
            }
        },

        // web server port
        port: 9876,

        // enable or disable colors in the output (reporters and logs)
        colors: true,

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        // Start these browsers, currently available:
        // - Chrome
        // - Firefox
        // - Safari (only Mac)
        // - PhantomJS
        browsers: ['Chrome'],

        // If browser does not capture in given timeout [ms], kill it
        captureTimeout: 60000,

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: true
    });
};
