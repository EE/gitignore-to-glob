'use strict';

const assert = require('assert');
const gitignoreToGlob = require('../lib/gitignore-to-glob');

const getProcessedArray = (gitignoreSuffixOrArray, dirsToCheck) =>
    Array.isArray(gitignoreSuffixOrArray) ?
        gitignoreSuffixOrArray :
        gitignoreToGlob(
            `${ __dirname }/fixtures/gitignore-${ gitignoreSuffixOrArray }`,
            dirsToCheck
        );

const assertContain = (gitignoreSuffixOrArray, elem) => {
    const processedArray = getProcessedArray(gitignoreSuffixOrArray);
    return assert.notEqual(processedArray.indexOf(elem), -1,
        `Expected ${ JSON.stringify(processedArray) } to contain ${ elem }`);
};

const assertNotContain = (gitignoreSuffixOrArray, elem) => {
    const processedArray = getProcessedArray(gitignoreSuffixOrArray);
    return assert.equal(processedArray.indexOf(elem), -1,
        `Expected ${ JSON.stringify(processedArray) } to not contain ${ elem }`);
};

const assertDeep = (gitignoreSuffixOrArray, expectedArray) => {
    const processedArray = getProcessedArray(gitignoreSuffixOrArray);
    return assert.deepEqual(processedArray, expectedArray);
};

describe('gitignoreToGlob', () => {
    it('should treat paths starting with "/" as relative to the main directory', () => {
        assertContain('slash', '!pattern');
    });

    it('should treat paths not starting with "/" as relative to all directories', () => {
        assertContain('noslash', '!**/pattern');
    });

    it('should not ignore files ignored in .gitignore', () => {
        assertContain('ignore', '**/pattern1');
        assertContain('ignore', 'pattern2');
    });

    it('should omit empty lines', () => {
        assertDeep('emptyline', ['!pattern1', '!pattern1/**', '!pattern2', '!pattern2/**']);
    });

    it('should omit comments', () => {
        assertDeep('comment', ['!pattern1', '!pattern1/**', '!pattern2', '!pattern2/**']);
    });

    it('should take `dirsToCheck` into account', () => {
        const processedArray = getProcessedArray('dirs', ['pattern1', 'pattern3']);
        assertContain(processedArray, '!pattern1');
        assertNotContain(processedArray, '!pattern2');
        assertContain(processedArray, '!pattern3');
    });
});
