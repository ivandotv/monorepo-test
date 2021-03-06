const { series } = require('async')
const path = require('path')
const { spawn } = require('child_process')
const { promises: fs } = require('fs')
const del = require('del')

const argv = require('minimist')(process.argv.slice(2))

const packageRelativePath = path.relative(__dirname, process.cwd())
const pkg = require(`${packageRelativePath}/package.json`)

process.env.BUILD_PACKAGE_NAME = pkg.name

const allBuilds = ['cjs', 'esm', 'umd']

const buildBundle = argv.bundle ? argv.bundle.split(',') : allBuilds

process.env.BUILD_TARGET = buildBundle.join(',')

console.log('build target ---->', process.env.BUILD_TARGET)

console.log({ buildBundle })
;(async () => {
  for (const build of buildBundle) {
    const deletedDirectoryPaths = await del([`dist/${build}`])

    console.log('Deleted directories:\n', deletedDirectoryPaths.join('\n'))
  }
})()

let tasks = [
  function (cb) {
    spawn(
      'yarn',
      ['--cwd', process.cwd(), 'rollup', '-c', '../../rollup.config.js'],
      {
        stdio: 'inherit',
        shell: true
      }
    ).on('exit', (code) => {
      cb(code)
    })
  }
]

if (buildBundle.indexOf('cjs') !== -1) {
  tasks = tasks.concat(async (cb) => {
    return await createCjsIndexFile(pkg.name)
  })
}
series(tasks)

async function createCjsIndexFile(libName) {
  const file = await fs.readFile('../../scripts/cjs-browser-template.js', {
    encoding: 'utf-8'
  })

  const replaced = file.replace(/__LIBRARY_NAME__/gm, libName)

  return await fs.writeFile('./dist/cjs/index.js', replaced)
}
