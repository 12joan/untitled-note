/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['<rootDir>/client/e2e'],
  moduleNameMapper: {
    '^~/(.*)$': '<rootDir>/client/$1',
  },
};
