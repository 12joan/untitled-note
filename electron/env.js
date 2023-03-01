const development = {
  app: {
    host: 'localhost:3000',
    protocol: 'http',
  },
  devTools: true,
}

const productionStaging = {
  app: {
    protocol: 'https',
  },
  devTools: false,
}

const production = {
  ...productionStaging,
  app: {
    ...productionStaging.app,
    host: 'untitlednote.xyz',
  },
}

const staging = {
  ...productionStaging,
  app: {
    ...productionStaging.app,
    host: 'staging.untitlednote.xyz',
  },
}

const environments = {
  development,
  production,
  staging,
}

const index = process.argv.indexOf('--env')
const envName = index > -1 ? process.argv[index + 1] : 'production'

module.exports = {
  ENV: environments[envName],
}
