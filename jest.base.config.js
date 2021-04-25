console.log('base config')
module.exports = {
  // testMatch: [
  // '<rootDir>/src/**/__tests__/**/*.[jt]s?(x)',
  // '<rootDir>/src/**/?(*.)+(spec|test).[jt]s?(x)',
  // '<rootDir>/tests/?(*.)+(spec|test).[jt]s?(x)'
  // '<rootDir>/packages/?(*.)+(speca|testa).[jt]s?(x)'
  // ],
  projects: ['<rootDir>/packages/*'],
  testEnvironment: 'jsdom',
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname'
  ],
  globals: {
    __DEV__: true,
    __VERSION__: true,
    __BUILD_DATE__: true,
    __COMMIT_SHA__: true
  },
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
}
