import preexit, { initialize } from './index'

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

describe('pre-exit', () => {
  let cleanupPreExit
  let cleanupHandler
  let mockExit
  let onExit
  beforeAll(() => {
    mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {})
    cleanupPreExit = initialize()
    onExit = jest.fn()
  })
  beforeEach(() => {
    mockExit.mockClear()
    onExit.mockClear()
    cleanupHandler = preexit(onExit)
  })
  afterEach(() => {
    cleanupHandler()
    cleanupPreExit()
  })

  const signals = ['SIGHUP', 'SIGINT', 'SIGTERM', 'SIGUSR2']
  describe('when no options are provided', () => {
    signals.forEach(signal => {
      it(`should exit when ${signal} is sent`, async () => {
        process.emit(signal)
        expect(mockExit).not.toBeCalled()
        expect(onExit).toBeCalled()
        await sleep(1)
        expect(mockExit).toBeCalled()
      })
    })

    it('should exit when an error is provided', async () => {
      process.exit(new Error('manual exit'))
      /* eslint-disable no-unreachable */
      expect(onExit).toBeCalled()
      await sleep(1)
      expect(mockExit).toBeCalled()
      /* eslint-enable no-unreachable */
    })

    it('should not call handler if it is cleaned up', async () => {
      cleanupHandler()
      process.exit(1)
      /* eslint-disable no-unreachable */
      expect(onExit).not.toBeCalled()
      /* eslint-enable no-unreachable */
    })
  })
})
