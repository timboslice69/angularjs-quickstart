// Karma configuration
// Generated on Fri Nov 28 2014 17:08:26 GMT+0100 (CET)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
      'src/lib/components/angular/angular.js',
      'src/lib/components/angular-resource/angular-resource.js',
      'src/lib/components/angular-route/angular-route.js',
      'src/lib/components/angular-sanitize/angular-sanitize.js',
      'src/lib/components/angular-mocks/angular-mocks.js',
      'src/lib/app/Providers.js',
      'src/lib/app/Services.js',
      'src/lib/app/Controllers.js',
      'src/lib/app/Components.js',
      'src/lib/app/Directives.js',
      'src/lib/app/Filters.js',
      'src/lib/app/Application.js',
      'tests/**/*.js'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter


    reporters: ['progress', 'html'],

    // the default configuration
    htmlReporter: {
      outputFile: 'reports/karma-jasmine-unit-tests.html'
    },

    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome', 'Safari'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true
  });
};