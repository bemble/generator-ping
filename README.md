# generator-ping

Yeoman generator to bootstrap AngularJs component oriented application, flavored with Typescript and other stuff.

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