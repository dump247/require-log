/*global define, describe, it, expect, beforeEach */

define(['log'], function (log) {
  describe('Manager', function () {
    beforeEach(function () {
      this.addMatchers({
        hasLevel: function (expected) {
          var result = this.actual.levels[expected] !== undefined &&
                       this.actual.Logger.prototype[expected] !== undefined;

          this.message = function () {
            return "Log level not found: " + expected;
          };

          return result;
        }
      });
    });

    it('has a version', function () {
      expect(log.version).toMatch(/\d+\.\d+\.\d+/);
    });

    it('has default levels', function () {
      expect(log).hasLevel('debug');
      expect(log).hasLevel('info');
      expect(log).hasLevel('warn');
      expect(log).hasLevel('error');
    });

    it('loads custom levels from config', function () {
      expect(log).hasLevel('test');
    });

    it('can add a single level', function () {
      expect(log).not.hasLevel('alert');

      log.addLevel('alert', 35000);
      expect(log).hasLevel('alert');

      log.removeLevel('alert');
      expect(log).not.hasLevel('alert');
    });

    it('can add multiple levels', function () {
      expect(log).not.hasLevel('alert');
      expect(log).not.hasLevel('trace');

      log.addLevel({
        trace: 100,
        alert: 35000
      });
      expect(log).hasLevel('alert');
      expect(log).hasLevel('trace');

      log.removeLevel('trace');
      log.removeLevel('alert');
      expect(log).not.hasLevel('alert');
      expect(log).not.hasLevel('trace');
    });

    it('can add level with value 0', function () {
      log.addLevel('trace0', 0);
      expect(log).hasLevel('trace0');

      log.removeLevel('trace0');
      expect(log).not.hasLevel('trace0');
    });

    it('can get a logger', function () {
      var logger = log.get('a');
      expect(logger).toBeDefined();
      expect(logger.constructor.prototype).toBe(log.Logger.prototype);

      // Multiple calls to get return the same logger
      var logger2 = log.get('a');
      expect(logger2).toBe(logger);
    });

    it('loader plugin', function () {
      var logger = null;
      log.load('a', null, function (l) { logger = l; });
      expect(logger).toBe(log.get('a'));
    });
  });
});

