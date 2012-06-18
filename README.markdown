Logging plugin for requirejs.

# Install

Put log.js in your requirejs loading path.

# Usage

Create a logger for your module:
```javascript
define(['log!foo'], function (log) {
  log.info('Module Loaded!');
});
```

You should see the following in your browser's console:
```
12:02:23 INFO         foo - Module loaded!
```

# TODO

* Custom log message handlers (aka appenders)
* Make minimum log level configurable

# Configuration

```javascript
require.config({
  config: {
    log: {
      // Root log level. Default is info.
      // Can also set the log level to 'all', 'none', or a custom level defined in levels config
      level: 'debug',

      // Add custom log levels. You can now call log.alert(...)
      // The config is mapping level name to relative priority value.
      // For example: error is currently set to 40000, so alert is a higher level
      // than error. The priority value is used for log message filtering.
      levels: { 
        alert: 100000
      }
    }
  }
});
```

# Default Log Levels

* *debug* (value: 10000)
* *info* (value: 20000)
* *warn* (value: 30000)
* *error* (value: 40000)

# License

The MIT License (MIT)  
Copyright (c) 2012 Cory Thomas

See [LICENSE](require-log/blob/master/LICENSE)

