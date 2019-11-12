const shutdownHandlers = []

function exit(errOrCode) {
  Promise.all(
    shutdownHandlers.map(handler =>
      // Make sure every handler return value is treated as a promise.
      // Also catch any rejections from handlers, because that would early-abort other handlers
      Promise.resolve(handler()).catch(err => err),
    ),
  ).finally(() => {
    let result
    if (Object.isPrototypeOf.call(Error.prototype, errOrCode)) {
      result = errOrCode.code || 1
    } else {
      result = errOrCode
    }
    ;(exit.raw || process.exit).call(process, result)
  })
}

function initialize(
  { SIGTERM, SIGHUP, SIGINT, SIGUSR2 } = {
    SIGTERM: true,
    SIGHUP: true,
    SIGINT: true,
    SIGUSR2: true,
  },
) {
  if (process.exit === exit) {
    return
  }

  const uninitializers = []

  exit.raw = process.exit
  process.exit = exit
  uninitializers.push(function unbind() {
    // clear previously bound shutdownHandlers
    shutdownHandlers.splice(0, shutdownHandlers.length)
    // reset original process.exit
    process.exit = exit.raw
    // clear bound exit
    exit.raw = undefined
  })

  process.once('beforeExit', exit)
  uninitializers.push(process.removeListener.bind(process, 'beforeExit', exit))

  const enabledSignals = { SIGTERM, SIGHUP, SIGINT, SIGUSR2 }
  Object.entries(enabledSignals)
    .filter(([_, enabled]) => enabled)
    .map(([signal]) => signal)
    .forEach(signal => {
      process.once(signal, exit)
      uninitializers.push(process.removeListener.bind(process, signal, exit))
    })

  return function uninitialize() {
    uninitializers.forEach(uninitializer => uninitializer())
  }
}

function unregisterShutdownHandler(handler) {
  const idx = shutdownHandlers.indexOf(handler)
  if (idx !== -1) {
    shutdownHandlers.splice(idx, 1)
  }
}

function registerShutdownHandler(handler) {
  initialize()
  shutdownHandlers.push(handler)
  return unregisterShutdownHandler.bind(null, handler)
}

export { initialize, exit, registerShutdownHandler, unregisterShutdownHandler }
export default registerShutdownHandler
