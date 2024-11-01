module.exports = {
  packagerConfig: {
    icon: './log-dpro-256',
    executableName: "drakonhub"
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        authors: 'Drakon Pro team',
        description: 'A drakon-chart and mind-map editor',
        // An URL to an ICO file to use as the application icon (displayed in Control Panel > Programs and Features).
        // The ICO file to use as the icon for the generated Setup.exe
        setupIcon: './log-dpro-256.ico',
      },
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {
        options: {
          icon: './log-dpro-256.png'
        }
      },
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
    },
  ],
};
