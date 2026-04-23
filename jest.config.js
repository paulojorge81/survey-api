/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

/** @type {import('jest').Config} */
const config = {
  roots: ['<rootDir>/src'],
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: ['<rootDir>/src/**/*', '!<rootDir>/src/main/**'],
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  preset: '@shelf/jest-mongodb',
  testMatch: [
    "**/*.spec.ts",
    "**/*.test.ts"
  ],
  transform: {
    '.+\\.ts$': 'ts-jest'
  }
};

module.exports = config;
