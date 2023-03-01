const vm = require('vm')
const assert = require('assert')
const readline = require('readline')

async function debug (context) {
  context = context || {}
  assert.strictEqual(Object.prototype.toString.call(context), '[object Object]')

  context.console = console // for debug
  vm.createContext(context)

  return new Promise((resolve, reject) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: '> '
    })
    rl.prompt()
    rl.on('line', (line) => {
      vm.runInContext(`(async () => {
        try {
          ${line}
        } catch(e) {
          console.error(e)
        }
      })()`, context).then(() => {
        rl.prompt()
      }).catch(e => {
        console.error(e)
        rl.prompt()
      })
    })
    rl.on('close', () => {
      rl.close()
      console.log('')
      resolve()
    })
  })
}

module.exports = debug
