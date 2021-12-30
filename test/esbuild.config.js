const esbuild = require('esbuild')
const copyStaticFiles = require('esbuild-copy-static-files')

const copySrc = './input/static'
const copyDest = './output'

esbuild.build({
  entryPoints: [`./input/js/app.js`],
  outfile: `${copyDest}/js/app.js`,
  bundle: true,
  minify: false,
  sourcemap: false,
  watch: false,
  plugins: [copyStaticFiles({src: copySrc, dest: copyDest})],
})
