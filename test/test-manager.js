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

    it('default level is info', function () {
      var level = log.getLevel();
      expect(level.name).toEqual('info');
    });

    it('can change root log level', function () {
      // Set using string level name
      log.setLevel('debug');
      expect(log.getLevel().name).toEqual('debug');

      // Set virtual 'all' level
      log.setLevel('all');
      expect(log.getLevel().name).toEqual('all');

      // Set virtual 'none' level
      log.setLevel('none');
      expect(log.getLevel().name).toEqual('none');

      // Set using level numeric value
      log.setLevel(30000);
      expect(log.getLevel().name).toEqual('warn');
      expect(log.getLevel().value).toEqual(30000);

      // Set using unknown level numeric value
      log.setLevel(30001);
      expect(log.getLevel().name).toBeUndefined();
      expect(log.getLevel().value).toEqual(30001);

      // Set using level object
      log.setLevel(log.levels.error);
      expect(log.getLevel().name).toEqual('error');

      // Set using custom level object w/o name
      log.setLevel({ value: 10000 });
      expect(log.getLevel().name).toEqual('debug');

      // Set using custom level object w/ name
      log.setLevel({ value: 10000, name: 'custom' });
      expect(log.getLevel().name).toEqual('debug');

      // Set using custom level object w/ name and custom value
      log.setLevel({ value: 10001, name: 'custom' });
      expect(log.getLevel().name).toEqual('custom');
      expect(log.getLevel().value).toEqual(10001);

      log.setLevel('info');
    });

    it('throws error when setting root level to unknown value', function () {
      // Unknown name
      expect(function () { log.setLevel('custom'); }).toThrow();

      // Invalid object
      expect(function () { log.setLevel({}); }).toThrow();
      expect(function () { log.setLevel(null); }).toThrow();
      expect(function () { log.setLevel(); }).toThrow();
    });

    it('changing root log level has required effect', function () {
      var l = log.get('test');
      l.debug('You should not see this message!');
      log.setLevel('debug');
      l.debug('You should see this message');
      log.setLevel('info');
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

    it('has "virtual" all/none levels set', function () {
      expect(log.levels.all).toEqual(Number.MIN_VALUE);
      expect(log.levels.none).toEqual(Number.MAX_VALUE);
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

