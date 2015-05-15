/**
 * Copy of setup code from Karma website to make work with requirejs.
 * This file is included both by karma test runner as well as our
 * index.html file that runs tests in the browser itself.
 *
 * We therefore perform different actions depending on which environment
 * we're running in.
 *
 */

// Define an array of "deps" for requirejs to have in karma environment only
var deps = [];
// Define a regex to match which of our files to load as deps in karma
// This is a match done against all the files karma has loaded into the
// base directory
var TEST_REGEXP = /advicefactory\.test\.js$/;
var pathToModule = function(path) {
    return path.replace(/^\/base\//, '').replace(/\.js$/, '');
};
//If this is karma define test files as deps to run when require has loaded
if(window.__karma__) {
    Object.keys(window.__karma__.files).forEach(function(file) {
        if (TEST_REGEXP.test(file)) {
            // Normalize paths to RequireJS module names.
            deps.push(pathToModule(file));
        }
    });
}
// Requirejs callback once all deps have loaded
function startTests() {
    // Start tests if karma
    if(window.__karma__) {
        window.__karma__.start();
    // Start tests if browser by requiring and
    // setting up mocha and then requiring the tests
    // and calling run
    } else {
        var allTestFiles = [
          'test/advicefactory.test'
        ];
        require(['mocha'], function(mocha) {
            mocha.setup('bdd');
            require(allTestFiles, function() {
                mocha.run();
            })
        });
    }
}

require.config({
    // Karma serves files under /base, which is the basePath from your config file
    baseUrl: window.__karma__ ? '/base' : '../',
    paths: {
        //---------- LIB ----------//
        chai: 'node_modules/chai/chai',
        mocha: 'node_modules/mocha/mocha',
        sinon: 'node_modules/sinonjs/sinon',
        jquery: 'node_modules/jquery/dist/jquery',
        "lodash": 'bower_components/lodash/dist/lodash',
        "functional-advice": 'node_modules/functional-advice/advice',
        "backbone": 'node_modules/backbone/backbone',
        "underscore": 'node_modules/underscore/underscore',
        "mutation.js/lodash.mutation": 'node_modules/mutation.js/lodash.mutation',
        "mutation": 'node_modules/mutation.js/mutation',
        "advicefactory": 'backbone-advicefactory'
    },
    shim: {
        'underscore': {
            exports: '_'
        },
        mocha: {
            exports: "mocha",
            init: function () {
                console.log('setting up mocha');
                this.mocha.setup('bdd');
                return this.mocha;
            }
        }
    },
    // dynamically load all test files in karma environment
    deps: deps,

    // callback once all deps have loaded
    callback: startTests,

    // If browser does not capture in given timeout [ms], kill it
    captureTimeout: 60000,

    waitSeconds: 60
});