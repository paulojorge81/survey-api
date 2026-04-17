/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

/** @type {import('jest').Config} */
const config = {
  roots: ['<rootDir>/src'],
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: ['<rootDir>/src/**/*'],
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  testMatch: [
    "**/*.spec.ts",
    "**/*.test.ts"
  ],
  transform: {
    '.+\\.ts$': 'ts-jest'
  }
};

module.exports = config;
