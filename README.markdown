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

# License

The MIT License (MIT)  
Copyright (c) 2012 Cory Thomas

See [LICENSE](require-log/blob/master/LICENSE)

