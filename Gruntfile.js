/**
 * gitignore-to-glob
 * https://github.com/EE/gitignore-to-glob
 *
 * Author Michał Gołębiowski-Owczarek <m.goleb@gmail.com>
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {
    require('time-grunt')(grunt);

    grunt.initConfig({
        clean: {
            all: {
                src: ['*.log', 'test/*/*-copy'],
            },
        },

        eslint: {
            all: {
                src: ['*.js', 'lib', 'test'],
            },
        },

        mochaTest: {
            all: {
                options: {
                    reporter: 'spec',
                },
                src: ['test/spec.js'],
            },
        },
    });

    // Load all grunt tasks matching the `grunt-*` pattern.
    require('load-grunt-tasks')(grunt);

    grunt.registerTask('lint', ['eslint']);

    grunt.registerTask('test', ['mochaTest']);

    grunt.registerTask('default', ['clean', 'lint', 'test']);
};
