const { execSync } = require('child_process')
const credentials = require('./credentials.js')

module.exports = {
  packagerConfig: {
    name: 'Untitled Note App',
    executableName: 'UntitledNoteApp',
    appBundleId: 'xyz.untitlednote.app',
    icon: 'icons/app-icon',
    osxSign: {},
    osxNotarize: {
      tool: 'notarytool',
      keychainProfile: credentials.osxNotarize.keychainProfile,
    },
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {},
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {
        options: {
          icon: 'icons/app-icon.png',
        },
      },
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
    },
  ],
  hooks: {
    generateAssets: () => {
      execSync('yarn run build')
    },
  },
  publishers: [
    {
      name: '@electron-forge/publisher-github',
      config: {
        repository: credentials.publishers.github.repository,
        authToken: credentials.publishers.github.authToken,
        prerelease: true,
      },
    },
  ],
}