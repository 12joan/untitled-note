module.exports = {
  osxNotarize: {
    keychainProfile: 'KEYCHAIN-PROFILE',
  },
  publishers: {
    github: {
      repository: {
        owner: 'GITHUB-OWNER',
        name: 'GITHUB-REPOSITORY',
      },
      authToken: 'GITHUB-AUTH-TOKEN',
    },
  },
  updateElectronApp: {
    repo: 'GITHUB-OWNER/GITHUB-REPOSITORY',
  },
}
