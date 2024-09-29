globalThis.ngJest = {
  skipNgcc: true,
  tsconfig: 'tsconfig.spec.json', // this is the project root tsconfig
};

/** @type {import('@jest/types').Config.InitialOptions} */
module.exports = {
  preset: 'jest-preset-angular',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setup-jest.ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest', // Only transform .ts files
  },
  transformIgnorePatterns: [
    '/node_modules/(?!flat)/', // Exclude modules except 'flat' from transformation
  ],
  coveragePathIgnorePatterns: [
    "/node_modules/",
    '<rootDir>/projects/util/src/lib/config/',
    "\\.spec\\.ts$", // Exclude test files
    "\\.mock\\.ts$", // Exclude mock files
  ],
  moduleNameMapper: {
    // '^src/(.*)$': '<rootDir>/src/$1',
    // '^d3$': 'node_modules/d3/dist/d3.min.js',
    '^@github-graphql-assignment/util$': '<rootDir>/projects/util/src/index.ts',
    '^@github-graphql-assignment/ui$': '<rootDir>/projects/ui/src/index.ts',
    '^@github-graphql-assignment/feature$': '<rootDir>/projects/feature/src/index.ts',
    '^@github-graphql-assignment/data-access$': '<rootDir>/projects/data-access/src/index.ts',
    '^@environment$': '<rootDir>/src/environments/environment.ts',
    '\\.(css|less|scss|sass)$': '<rootDir>/styleMock.js', // Add this line

  },
  moduleDirectories: ['node_modules', 'src'],
  fakeTimers: {
    enableGlobally: true,
  }
};
