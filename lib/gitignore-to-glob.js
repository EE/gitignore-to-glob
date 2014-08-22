/**
 * gitignore-to-glob
 * https://github.com/EE/gitignore-to-glob
 *
 * Author Michał Gołębiowski <m.goleb@gmail.com>
 * Licensed under the MIT license.
 */

'use strict';

var fs = require('fs'),
    path = require('path');

module.exports = function gitignoreToGlob(gitignorePath, dirsToCheck) {
    gitignorePath = path.resolve(gitignorePath || '.gitignore');

    return fs.readFileSync(gitignorePath, {encoding: 'utf8'})
        .split('\n')
        // Filter out empty lines and comments.
        .filter(function (pattern) {
            return !!pattern && pattern[0] !== '#';
        })
        // Prepend the '!' flag to ignore those files instead of linting them.
        // Return pairt [ignoreFlag, pattern], we'll collect it later.
        .map(function (pattern) {
            if (pattern[0] === '!') {
                return ['', pattern.substring(1)];
            }
            return ['!', pattern];
        })
        // Filter out hidden files/directories (i.e. starting with a dot).
        .filter(function (patternPair) {
            var pattern = patternPair[1];
            return pattern.indexOf('/.') === -1 && pattern.indexOf('.') !== 0;
        })
        // There may be a lot of files outside of directories from `dirsToCheck`, don't ignore them wasting time.
        .filter(function (patternPair) {
            var pattern = patternPair[1];
            return pattern[0] !== '/' || !dirsToCheck ||
                new RegExp('^\/(?:' + dirsToCheck.join('|') + ')(?:\/|$)').test(pattern);
        })
        // Patterns not starting with '/' are in fact "starting" with '**/'. Since that would catch a lot
        // of files, restrict it to directories we check.
        // Patterns starting with '/' are relative to the project directory and Grunt would treat them as
        // relative to the OS root directory so strip the slash then.
        .map(function (patternPair) {
            var pattern = patternPair[1];
            if (pattern[0] !== '/') {
                return [patternPair[0], (dirsToCheck ? '{' + dirsToCheck + '}/' : '') + '**/' + pattern];
            }
            return [patternPair[0], pattern.substring(1)];
        })
        // We don't know whether a pattern points to a directory or a file and Grunt needs files.
        // Therefore, include both `pattern` and `pattern/**` for every pattern in the array.
        .reduce(function (result, patternPair) {
            var pattern = patternPair.join('');
            result.push(pattern);
            result.push(pattern + '/**');
            return result;
        }, []);

};
