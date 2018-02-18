import * as rc from 'rc'

export const getConfig = (() => {
  let cachedConfig: any

  return () => {
    if (!cachedConfig) {
      cachedConfig = rc('backstage', {
        tempDirectory: '/tmp',
      })
    }

    return cachedConfig
  }
})()
