Logging plugin for requirejs.

# Usage

Create a logger for your module:
```javascript
define(['log!foo'], function (log) {
  log.info('Module Loaded!');
});
```

# TODO

* Custom log message handlers (aka appenders)
* Make minimum log level configurable

# License

The MIT License (MIT)  
Copyright (c) 2012 Cory Thomas

See [LICENSE](require-log/blob/master/LICENSE)

