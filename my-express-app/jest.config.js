module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src", "<rootDir>/__tests__"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov"],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  moduleNameMapper: {
    "^@controllers/(.*)$": "<rootDir>/src/controllers/$1",
    "^@routes/(.*)$": "<rootDir>/src/routes/$1",
    "^@services/(.*)$": "<rootDir>/src/services/$1",
    "^@config/(.*)$": "<rootDir>/src/config/$1",
    "^@tests/(.*)$": "<rootDir>/__tests__/$1",
  },
};
