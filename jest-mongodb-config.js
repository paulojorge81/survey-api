export default {
  mongodbMemoryServerOptions: {
    binary: {
      version: '8.2',
      skipMD5: true,
    },
    autoStart: false,
    instance: {
      dbName: 'jest'
    },
  },
};
