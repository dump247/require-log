/*global define, describe, it, expect */

define(['log'], function (log) {
  describe('Logger', function () {
    it('has a name', function () {
      expect(log.get('test').name).toEqual('test');
      expect(log.get('test/b').name).toEqual('test/b');
    });

    it('can log default levels', function () {
      for (var name in log.levels) {
        if (log.get('test')[name]) { // Virtual levels, such as all/none, do not have corresponding functions
          log.get('test')[name]('Test',this.suite.description,this.description);
        }
      }
    });
  });
});

