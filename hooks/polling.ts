import { useRef, useEffect, useCallback } from 'react'

const useIntervalAsync = <R = boolean>(fn: () => Promise<R>, ms = 3000) => {
  const runningCount = useRef(0)
  const timeout = useRef<number>()
  const mountedRef = useRef(false)

  const next = useCallback(
    (handler: TimerHandler) => {
      if (mountedRef.current && runningCount.current === 0) {
        timeout.current = window.setTimeout(handler, ms);
      }
    },
    [ms]
  )

  const run = useCallback(async () => {
    runningCount.current++
    const result = await fn()
    runningCount.current--

    // if true, means this polling is completed
    if (result) return

    next(run)

    return result
  }, [fn, ms])

  useEffect(() => {
    mountedRef.current = true
    run()
    return () => {
      mountedRef.current = false
      window.clearTimeout(timeout.current)
    }
  }, [run])

  const flush = useCallback(() => {
    window.clearTimeout(timeout.current)
    return run()
  }
  , [run])

  return flush
}

export default useIntervalAsync