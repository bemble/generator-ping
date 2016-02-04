# generator-ping

[![NPM version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Coverage Status][coveralls-image]][coveralls-url]

> Yeoman generator to bootstrap AngularJs component oriented application, flavored with Typescript and other stuff.

## Installation

```sh
npm install -g generator-ping
```

## What does it bring?

* `angular` & `angular-material` component oriented application
* `font-awesome` icons
* `jade`, `typescript` & `less`
* `express` dev server
* `karma` and `protractor` tests
* build process
* `component`, `page` & angular `service` generation helpers (with their tests), see below
* IDE configuration (Webstorm & VisualStudio Code)

## Generation helpers

### Create a new component

Components are created in the `src/components` folder.
This generator also bootstraps `karma` and `protractor` tests.

```sh
yo ping:component
```

### Create a new page

A page is a component, prefixed with `Page`, with its route configured in the application (`src/app.ts`).

```sh
yo ping:page
```

### Create a new AngularJs service

```sh
yo ping:service
```
### IDE configuration

You might want to configure your IDE to quickly start developing without spending time with configuration.
Just do the following command and select you IDE:

```sh
yo ping:ide
```

See just below what the generator do to your IDE.

#### WebStorm

* Javascript standard used is ES6 (to prevent any warning or error in node some files (gulp for example))
* UTF-8 file encoding
* `Karma tests` run task configured

#### VisualStudio Code

* Javascript standard used is ES6 (to prevent any warning or error in node some files (gulp for example))
* UTF-8 file encoding
* tab size set to 2
* some files are excluded from the project tree
* the `test` task with problem matcher is configured to run `default` gulp task and match Karma errors
* the `build` task is configured to run `build` gulp task

## Dev notes

To run the tests, simply install `mocha` globally and run:

```sh
mocha
```

[npm-url]:https://npmjs.org/package/generator-ping
[npm-image]:https://badge.fury.io/js/generator-ping.svg
[travis-url]:https://travis-ci.org/pierrecle/generator-ping
[travis-image]:https://travis-ci.org/pierrecle/generator-ping.svg?branch=master
[coveralls-url]:https://coveralls.io/github/pierrecle/generator-ping?branch=master
[coveralls-image]:https://coveralls.io/repos/github/pierrecle/generator-ping/badge.svg?branch=master