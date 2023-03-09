const development = {
  app: {
    host: 'localhost:3000',
    protocol: 'http',
  },
  devTools: true,
}

const production = {
  app: {
    host: 'untitlednote.xyz',
    protocol: 'https',
  },
  devTools: false,
}

const staging = {
  app: {
    host: 'staging.untitlednote.xyz',
    protocol: 'https',
  },
  devTools: true,
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
