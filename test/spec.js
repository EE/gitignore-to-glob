'use strict';

var assert = require('assert'),
    gitignoreToGlob = require('../lib/gitignore-to-glob');

function getProcessedArray(gitignoreSuffixOrArray, dirsToCheck) {
    return Array.isArray(gitignoreSuffixOrArray) ?
        gitignoreSuffixOrArray :
        gitignoreToGlob(__dirname + '/fixtures/gitignore-' + gitignoreSuffixOrArray, dirsToCheck);
}

function assertContain(gitignoreSuffixOrArray, elem) {
    var processedArray = getProcessedArray(gitignoreSuffixOrArray);
    return assert.notEqual(processedArray.indexOf(elem), -1,
        'Expected ' + JSON.stringify(processedArray) + ' to contain ' + elem);
}

function assertNotContain(gitignoreSuffixOrArray, elem) {
    var processedArray = getProcessedArray(gitignoreSuffixOrArray);
    return assert.equal(processedArray.indexOf(elem), -1,
        'Expected ' + JSON.stringify(processedArray) + ' to not contain ' + elem);
}

function assertDeep(gitignoreSuffixOrArray, expectedArray) {
    var processedArray = getProcessedArray(gitignoreSuffixOrArray);
    return assert.deepEqual(processedArray, expectedArray);
}

describe('gitignoreToGlob', function () {
    it('should treat paths starting with "/" as relative to the main directory', function () {
        assertContain('slash', '!pattern');
    });

    it('should treat paths not starting with "/" as relative to all directories', function () {
        assertContain('noslash', '!**/pattern');
    });

    it('should not ignore files ignored in .gitignore', function () {
        assertContain('ignore', '**/pattern1');
        assertContain('ignore', 'pattern2');
    });

    it('should omit empty lines', function () {
        assertDeep('emptyline', ['!pattern1', '!pattern1/**', '!pattern2', '!pattern2/**']);
    });

    it('should omit comments', function () {
        assertDeep('comment', ['!pattern1', '!pattern1/**', '!pattern2', '!pattern2/**']);
    });

    it('should take `dirsToCheck` into account', function () {
        var processedArray = getProcessedArray('dirs', ['pattern1', 'pattern3']);
        assertContain(processedArray, '!pattern1');
        assertNotContain(processedArray, '!pattern2');
        assertContain(processedArray, '!pattern3');
    });
});
