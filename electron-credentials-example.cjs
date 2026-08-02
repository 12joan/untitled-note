module.exports = {
  osxSign: {
    identity: 'Developer ID Application: <NAME> (<ID>)',
  },
  osxNotarize: {
    /**
     * 1. Run `xcrun notarytool store-credentials untitled`
     * 2. Leave 'Path to App Store Connect API private key' empty
     * 3. Enter your Apple ID
     * 4. Generate an app-specific password (https://appleid.apple.com)
     * 5. Create an App ID identifier (https://developer.apple.com/account/resources/identifiers/list)
     * 6. Enter the App ID Prefix in the 'Developer Team ID' field
     */
    keychainProfile: 'untitled',
  },
  publishers: {
    github: {
      /**
       * 1. Go to https://github.com/settings/tokens?type=beta
       * 2. Generate a new token with access to the target repo
       * 3. Set repo permissions to read metadata and read/write code
       */
      authToken: 'GITHUB-AUTH-TOKEN',
    },
  },
  updateElectronApp: {
    repo: 'GITHUB-OWNER/GITHUB-REPOSITORY',
  },
};
