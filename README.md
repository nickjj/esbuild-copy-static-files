# esbuild-copy-static-files

![CI](https://github.com/nickjj/esbuild-copy-static-files/workflows/CI/badge.svg?branch=main)

An [esbuild](https://esbuild.github.io/) plugin to efficiently copy static
files from a source directory to a destination directory.

✔️ Only copy files that changed *(it compares an MD5 hash of each `src` and `dest` file)*  
✔️  No 3rd party dependencies *(it only uses a few functions from Node's standard library)*

## Demo Video

This video mostly covers what's in this README along with a bit more detail
around the "why".

[![Demo
Video](https://img.youtube.com/vi/bMkmwq5tzSs/0.jpg)](https://www.youtube.com/watch?v=bMkmwq5tzSs)

## Why?

So you've decided that you want to copy HTML, icons, images, fonts and other
static files from a source directory to a destination directory through
esbuild. Great, I do too.

Blindly recursively copying a `src` to `dest` directory can be both inefficient
and distracting. For example if you have 50 static files and update a single JS
file then you'll end up copying all 50 static files over.

That's creating a lot of unnecessary disk writes. Depending on which web
framework you use, that might cause a lot of log spam in development too. That
could be due to live reload picking up a bunch of files that technically
changed.

This plugin fixes the above because it'll only copy static files if they
changed on disk since they were last copied. You can think of this plugin as
being similar to using `rsync` instead of `cp` on the command line except
there's no extra watcher or command that you need to run. It's all seamlessly
integrated into esbuild.

### How it works at a high level

For most web apps, when it comes to my front-end I like the idea of this type of directory structure:

```sh
# This is where your assets are located and is used as input for esbuild.
assets/
├── css/
│   └── app.css
├── js/
│   └── app.js
├── static/
│   ├── images/
│   │   └── logo.png
│   ├── favicon.ico
│   ├── robots.txt
├── esbuild.config.js
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── yarn.lock

# This is the output of where esbuild will write its file(s) to.
public/
├── css/
│   └── app.css
├── js/
│   └── app.js
├── images/
│   └── logo.png
├── favicon.ico
├── robots.txt
```

In my opinion it's really nice having all of your assets in 1 spot which then
get output to another location.

esbuild manages the `js/` directory and TailwindCSS (or whatever you prefer)
manages the `css/` directory but that leaves us with a bunch of static files
that are composed of HTML, icons, images, fonts and more.

This esbuild plugin will copy your static files to your esbuild output
directory. No processing will be done on these static files. It's a quick `cp`
and only files that have changed are copied so it's really efficient.

You can name your `static/` and `public/` directories and configure their paths
however you want. We'll go over all of the configuration options in a bit.

## Installation

Just a heads up, this package uses Node's `fs.cpSync` function which depends on
using at least Node v16.7.

```sh
# Prefer Yarn?
yarn add --dev esbuild-copy-static-files

# Or NPM instead?
npm install --save-dev esbuild-copy-static-files
```

You can check it out on: <https://www.npmjs.com/package/esbuild-copy-static-files>

## Getting Started

If you had the same directory structure as above, here's the bare minimum
esbuild config to get going:

```js
const esbuild = require('esbuild')
const copyStaticFiles = require('esbuild-copy-static-files')

esbuild.build({
  entryPoints: ['./js/app.js'],
  outfile: '../public/js/app.js',
  bundle: true,
  minify: true,
  sourcemap: false,
  watch: false,
  plugins: [copyStaticFiles()],
})
```

## Configuration

This plugin uses Node's [`fs.cpSync`
function](https://nodejs.org/api/fs.html#fscpsyncsrc-dest-options) under the
hood. Any option that it has can be configured here.

Here's a list of what you can configure and the default values if you don't
override them:

```js
  plugins: [
    copyStaticFiles({
      src: './static',
      dest: '../public',
      dereference: true,
      errorOnExist: false,
      filter: EXPLAINED_IN_MORE_DETAIL_BELOW,
      preserveTimestamps: true,
      recursive: true,
    })
  ],
```

**In most cases you'll likely only change the `src` and `dest` to fit your
project's directory structure.**

Here's the docs of every configurable option from Node's documentation:

- `src` source path to copy.
- `dest` destination path to copy to.
- `dereference` dereference symlinks.
- `errorOnExist` when `force` is `false` and the destination exists, throw an error.
- `filter` function to filter copied files / directories. Return `true` to copy the item, `false` to ignore it.
- `force` overwrite existing file or directory. The copy operation will ignore errors if you set this to false and the destination exists. Use the `errorOnExist` option to change this behavior.
- `preserveTimestamps` when `true` timestamps from `src` will be preserved.
- `recursive` copy directories recursively.

### How does the filter function work?

By default it will filter out, AKA skip copying any files that haven't changed.
It does this by getting the MD5 hash of each `src` and `dest` file. If both
files have the same MD5 hash then it gets skipped.

This is nice because if you had let's say 50 static files and only 1 of them
changed then only 1 file will get copied.

#### Using a custom filter function

If you can think of a more efficient way of detecting which file(s) should get
copied you can customize the filter function by providing your own function
that returns `true` or `false` based on whatever criteria you prefer.

Here's an example of a simple filter function that always returns `true`:

```js
  plugins: [
    copyStaticFiles({
      filter: function () { return true },
    })
  ],
```

## About the author

- Nick Janetakis | <https://nickjanetakis.com> | [@nickjanetakis](https://twitter.com/nickjanetakis)

I'm a self taught developer and have been freelancing for the last ~20 years.
You can read about everything I've learned along the way on my site at
[https://nickjanetakis.com](https://nickjanetakis.com/).

There's hundreds of [blog posts / videos](https://nickjanetakis.com/blog/) and
a couple of [video courses](https://nickjanetakis.com/courses/) on web
development and deployment topics. I also have a
[podcast](https://runninginproduction.com) where I talk with folks about
running web apps in production.
