# gitignore-to-glob

> Transforms .gitignore patterns to ones compatible with the glob package (used by Grunt & others)

[![Build Status](https://travis-ci.org/EE/gitignore-to-glob.svg?branch=master)](https://travis-ci.org/EE/gitignore-to-glob.svg)
[![Build status](https://ci.appveyor.com/api/projects/status/oi2hv39087wp6c00/branch/master)](https://ci.appveyor.com/project/mzgol/gitignore-to-glob/branch/master)
## Installation

To install the package and add it to your `package.json`, invoke:

```shell
npm install gitignore-to-glob --save-dev
```

## Rationale

`.gitignore` uses a different format than the `glob` package used, among others, by Grunt. Sometimes it's desirable
to exclude files excluded by `.gitignore` in a glob pattern so a transformation function is needed.

## Usage

Once the package has been installed, it may be used via:

```js
require('gitignore-to-glob')(pathToGitignore, dirsToCheck);
```
where `pathToGitignore` is `'.gitignore'` by default and `dirsToCheck` is an optional array of directories where we
assume all files matched by the glob pattern exist. The parameter is optional but may be passed for performance reasons.
The rationale is that `.gitignore` patterns not starting with `/` are treated as if a glob pattern started with `**/`
and that would be expensive as some directories like `node_modules` usually contain a lot of files so excluding them
all manually would be slow.


## Usage Examples

The most basic usage:
```js
require('gitignore-to-glob')();
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using `npm test`.

## License
Copyright (c) 2014 Laboratorium EE. Licensed under the MIT license.
