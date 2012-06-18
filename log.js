/**
 * @license require-log Copyright (c) 2012, Cory Thomas
 * Available via the MIT license.
 * see: http://github.com/dump247/require-log for details
 */

 /*global define, window */

define(['module'], function (module) {
  var noop = function () {};
  var createLevelMethod = function (name) { return noop; };
  var config = module.config();

  if (window.console) {
    createLevelMethod = function (name) {
      var consoleMethod = window.console[name] || window.console.log;
      return function () { consoleMethod.apply(window.console, arguments); };
    };
  } else if (window.opera.postError) {
    createLevelMethod = function (name) {
      return function () {
        window.opera.postError(window.opera, Array.prototype.slice.call(arguments, 0).join(' '));
      };
    };
  }

  var log = {
    version: '0.0.1',
    _rootLevel: { name: 'all', value: Number.MIN_VALUE },

    levels: {
      // "virtual" levels useful for configuration
      all: Number.MIN_VALUE,
      none: Number.MAX_VALUE
    },

    loggers: {},

    Logger: function (name) {
      this.name = name;
      this._paddedName = ('          ' + name).substring(-10);
    },

    addLevel: function (name, value) {
      if (value !== undefined) {
        var logMethod = createLevelMethod(name);
        var paddedName = (name.toUpperCase() + '     ').substring(0, 5);

        this.levels[name] = { value: value };

        this.Logger.prototype[name] = function () {
          if (value >= log._rootLevel.value) {
            var args = Array.prototype.slice.call(arguments, 0);
            args.unshift('-');
            args.unshift(this._paddedName);
            args.unshift(paddedName);
            args.unshift(new Date().toTimeString().substring(0, 8));
            logMethod.apply(window, args);
          }
        };
      } else {
        for (var key in name) {
          this.addLevel(key, name[key]);
        }
      }
    },

    removeLevel: function (name) {
      delete this.levels[name];
      delete this.Logger.prototype[name];
    },

    setLevel: function (level) {
      if (log.levels[level]) {
        log._rootLevel = { name: level, value: log.levels[level].value };
      } else if (typeof level.value === 'number') {
        log.setLevel(level.value);

        if (level.name && !log._rootLevel.name) {
          log._rootLevel.name = level.name;
        }
      } else if (typeof level === 'number') {
        log._rootLevel = { value: level };

        for (var levelName in log.levels) {
          if (log.levels[levelName].value === level) {
            log._rootLevel = { name: levelName, value: log.levels[levelName].value };
            break;
          }
        }
      } else {
        throw 'Unknown log level: ' + level;
      }
    },

    getLevel: function () {
      return log._rootLevel;
    },

    get: function (name) {
      var logger = this.loggers[name];

      if (!logger) {
        logger = new this.Logger(name);
        this.loggers[name] = logger;
      }

      return logger;
    },

    load: function (name, parentRequire, load, config) {
      load(this.get(name));
    }
  };

  // Add default log levels to the log manager
  log.addLevel({
    debug: 10000,
    info:  20000,
    warn:  30000,
    error: 40000
  });

  // Add log levels from configuration
  if (config.levels) log.addLevel(config.levels);

  // Set root log level (config or default to info)
  log.setLevel(config.level === undefined ? log.levels.info : config.level);

  return log;
});

