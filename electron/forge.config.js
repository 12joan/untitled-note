const { execSync } = require('child_process');
const credentials = require('../electron-credentials');

module.exports = {
  packagerConfig: {
    name: 'Untitled Note App',
    executableName: 'UntitledNoteApp',
    appBundleId: 'xyz.untitlednote.app',
    icon: 'icons/app-icon',
    ignore: [
      /^\/out\//g, // See https://github.com/electron/forge/issues/3310
      '/\\.yarn($|/)',
    ],
    osxSign: {
      identity: credentials.osxSign.identity,
    },
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
      execSync('yarn run build');
    },
  },
  publishers: [
    {
      name: '@electron-forge/publisher-github',
      config: {
        repository: {
          owner: '12joan',
          name: 'untitled-note-app-releases',
        },
        authToken: credentials.publishers.github.authToken,
        prerelease: true,
      },
    },
  ],
};
