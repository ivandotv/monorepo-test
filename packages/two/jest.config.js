console.log('main config')
const baseConfig = require('../../jest.base.config')

module.exports = {
  ...baseConfig,
  rootDir: '.',
  projects: undefined,
  testMatch: ['<rootDir>/src/__tests__/?(*.)+(spec|test).[jt]s?(x)'],
  collectCoverageFrom: [
    '<rootDir>/src/**',
    '!<rootDir>/src/index.ts',
    '!<rootDir>/src/__tests__/**',
    '!<rootDir>/src/__fixtures__/**'
  ]
}
