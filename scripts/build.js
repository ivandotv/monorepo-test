// const pkg = require('../package.json')
const { series } = require('async')
const path = require('path')
const { spawn } = require('child_process')
const { promises: fs } = require('fs')
const { exportDefaultSpecifier } = require('@babel/types')

const argv = require('minimist')(process.argv.slice(2))

const target = argv.target
const bundles = argv.bundle && argv.bundle.split(',')

console.log({ target })
console.log({ bundles })

const packageRelativePath = path.relative(__dirname, process.cwd())

const pkg = require(`${packageRelativePath}/package.json`)

const buildTarget = pkg.buildTarget

if (target === 'browser') {
  // run browser script
  spawn('node', ['../../scripts/browser-cjs.js', '--builds=cjs,esm-ako'], {
    stdio: 'inherit',
    shell: true
  })
} else if (target === 'server') {
  // run server script
}

return
///////////////////////////////
if (!buildTarget || buildTarget.length === 0) {
  throw new Error(`key: "buildTarget" in package.json not found or empty.
  Please add "buildTarget" key to package.json with the value of "browser" or "server".
  `)
}

// if build target browser
console.log('👷 build target: ', buildTarget)

if (buildTarget === 'server') {
  spawn('yarn', ['server:build'], {
    stdio: 'inherit',
    shell: true
  })
} else {
  // browser
  spawn('yarn', ['browser:build'], {
    stdio: 'inherit',
    shell: true
  })
}
