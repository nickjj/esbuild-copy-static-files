const crypto = require('crypto')
const fs = require('fs')

const getDigest = (string) => {
  const hash = crypto.createHash('md5')
  const data = hash.update(string, 'utf-8')

  return data.digest('hex')
}

const getFileDigest = (path) => {
  if (!fs.existsSync(path)) {
    return null
  }

  if (fs.statSync(path).isDirectory()) {
    return null
  }

  return getDigest(fs.readFileSync(path))
}

function filter(src, dest) {
  if (!fs.existsSync(dest)) {
    return true
  }

  if (fs.statSync(dest).isDirectory()) {
    return true
  }

  return getFileDigest(src) !== getFileDigest(dest)
}

module.exports = (options = {}) => ({
  name: 'copy-static-files',
  setup(build) {
    let src = options.src || './static'
    let dest = options.dest || '../public'

    build.onEnd(() => fs.cpSync(src, dest, {
      dereference: options.dereference || true,
      errorOnExist: options.errorOnExist || false,
      filter: options.filter || filter,
      force: options.force || true,
      preserveTimestamps: options.preserveTimestamps || true,
      recursive: options.recursive || true,
    }))
  },
})
