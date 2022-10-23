const retry = (
  func,
  {
    maxRetries = 5,
    interval = 1000,
    shouldRetry = () => true,
  } = {},
) => new Promise((resolve, reject) => {
  const attempt = retriesLeft => func()
    .then(resolve)
    .catch(error => {
      if (retriesLeft === 0 || !shouldRetry(error)) {
        reject(error)
      } else {
        console.warn(error)
        console.warn(`Retrying in ${interval}ms...`)
        setTimeout(() => attempt(retriesLeft - 1), interval)
      }
    })

  attempt(maxRetries)
})

export default retry
