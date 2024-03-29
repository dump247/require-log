/*global require, jasmine*/

require.config({
  map: {
    '*': {
      'log': '../log'
    }
  },

  config: {
    '../log': {
      levels: {
        'trace1' : 100,
        'test': 100000
      }
    }
  }
});

require([
  // Tests
  'test-manager',
  'test-logger',

  // RequireJS Plugins
  'lib/domReady!'
], function () {
  var jasmineEnv = jasmine.getEnv();
  var reporter = new jasmine.TrivialReporter();

  jasmineEnv.addReporter(reporter);
  jasmineEnv.specFilter = function (spec) {
    return reporter.specFilter(spec);
  };

  jasmineEnv.execute();
});

