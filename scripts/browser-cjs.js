const { series } = require('async')
const path = require('path')
const { spawn } = require('child_process')
const { promises: fs } = require('fs')
const del = require('del')

const packageRelativePath = path.relative(__dirname, process.cwd())

const pkg = require(`${packageRelativePath}/package.json`)

console.log('dirname ', __dirname)
console.log('cwd ', process.cwd())
console.log(`relative `, path.relative(__dirname, process.cwd()))
console.log('PKG name ', pkg.name)
console.log('babel env ', process.env.BABEL_ENV)
// return
;(async () => {
  const deletedDirectoryPaths = await del(['dist/cjs'])
  console.log('Deleted directories:\n', deletedDirectoryPaths.join('\n'))
})()

series([
  function (cb) {
    // build browser cjs development and production versions
    process.env.NODE_ENV = 'development'
    process.env.BUILD = 'cjsBrowserDev,cjsBrowserProd'
    spawn(
      'yarn',
      ['--cwd', process.cwd(), 'rollup', '-c', '../../rollup.config.js'],
      {
        stdio: 'inherit',
        shell: true,
        env: {
          ...process.env,
          BUILD_PACKAGE_NAME: pkg.name
        }
      }
    ).on('exit', (code) => {
      cb(code)
    })
  },
  async (cb) => {
    return await createIndexFile(pkg.name)
  }
])

async function createIndexFile(libName) {
  const file = await fs.readFile('../../scripts/cjs-browser-template.js', {
    encoding: 'utf-8'
  })

  const replaced = file.replace(/__LIBRARY_NAME__/gm, libName)

  return await fs.writeFile('./dist/cjs/index.js', replaced)
}
