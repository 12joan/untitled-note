const { execSync } = require('child_process')

module.exports = {
  packagerConfig: {
    name: 'Untitled Note App',
    executableName: 'UntitledNoteApp',
    appBundleId: 'xyz.untitlednote.app',
    icon: 'icons/app-icon',
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
}
