// Encapsulation of configurable backoff/jitter behavior.
//
// - The system can either be in a "good" state or a "bad" state. The initial state is "bad"; the
// caller is responsible for indicating when it transitions to "good". When we ask for a new retry
// delay, that implies the state is now transitioning to "bad".
//
// - There is a configurable base delay, which can be changed at any time (if the SSE server sends
// us a "retry:" directive).
//
// - There are optional strategies for applying backoff and jitter to the delay.

export function RetryDelayStrategy(baseDelayMillis: number, resetIntervalMillis: number, backoff?: any, jitter?: any) {
  let currentBaseDelay = baseDelayMillis
  let retryCount = 0
  let goodSince
  return {
    nextRetryDelay: function (currentTimeMillis) {
      if (goodSince && resetIntervalMillis && currentTimeMillis - goodSince >= resetIntervalMillis) {
        retryCount = 0
      }
      goodSince = null
      const delay = backoff ? backoff(currentBaseDelay, retryCount) : currentBaseDelay
      retryCount++
      return jitter ? jitter(delay) : delay
    },

    setGoodSince: function (goodSinceTimeMillis) {
      goodSince = goodSinceTimeMillis
    },

    setBaseDelay: function (baseDelay) {
      currentBaseDelay = baseDelay
      retryCount = 0
    },
  }
}

export function defaultBackoff(maxDelayMillis: number): any {
  return function (baseDelayMillis, retryCount) {
    const d = baseDelayMillis * Math.pow(2, retryCount)
    return d > maxDelayMillis ? maxDelayMillis : d
  }
}

export function defaultJitter(ratio: number): any {
  return function (computedDelayMillis) {
    return computedDelayMillis - Math.trunc(Math.random() * ratio * computedDelayMillis)
  }
}
