export interface RequestLimiter {
  readonly count: number
  run<T>(task: () => Promise<T>): Promise<T>
}

export interface RequestLimiterOptions {
  budget: number
  paceMs?: number
  wait?: (milliseconds: number) => Promise<void>
}

export class RequestBudgetExceededError extends Error {
  constructor(budget: number) {
    super(`Request budget of ${budget} was exceeded`)
    this.name = 'RequestBudgetExceededError'
  }
}

export const createRequestLimiter = ({
  budget,
  paceMs = 0,
  wait = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds)),
}: RequestLimiterOptions): RequestLimiter => {
  if (!Number.isSafeInteger(budget) || budget < 1) throw new Error('Request budget must be positive')
  if (!Number.isSafeInteger(paceMs) || paceMs < 0 || paceMs > 60_000) {
    throw new Error('Request pacing must be between 0 and 60000 milliseconds')
  }
  let count = 0
  let startQueue = Promise.resolve()

  return {
    get count() {
      return count
    },
    async run<T>(task: () => Promise<T>): Promise<T> {
      const start = startQueue.then(async () => {
        if (count >= budget) throw new RequestBudgetExceededError(budget)
        if (count && paceMs) await wait(paceMs)
        count += 1
      })
      startQueue = start.catch(() => undefined)
      await start
      return task()
    },
  }
}

export const mapWithConcurrency = async <Input, Output>(
  values: Input[],
  concurrency: number,
  map: (value: Input) => Promise<Output>
): Promise<Output[]> => {
  if (!Number.isSafeInteger(concurrency) || concurrency < 1 || concurrency > 6) {
    throw new Error('Concurrency must be an integer from 1 to 6')
  }
  const output = new Array<Output>(values.length)
  let nextIndex = 0
  const workers = Array.from({ length: Math.min(concurrency, values.length) }, async () => {
    while (nextIndex < values.length) {
      const index = nextIndex
      nextIndex += 1
      output[index] = await map(values[index])
    }
  })
  await Promise.all(workers)
  return output
}
