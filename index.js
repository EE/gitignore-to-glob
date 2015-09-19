'use strict';

// Disable options that don't work in Node.js 0.12.
// Gruntfile.js & tasks/*.js are the only non-transpiled files.
/* eslint-disable no-var, no-eval */

var assert = require('assert');

try {
    assert.strictEqual(eval('(() => 2)()'), 2);
    module.exports = require('./lib/gitignore-to-glob');
} catch (e) {
    module.exports = require('./dist/lib/gitignore-to-glob');
}
