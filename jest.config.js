/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/backend/tests"],
  moduleFileExtensions: ["ts", "js", "json"],
  globals: {
    "ts-jest": {
      tsconfig: "<rootDir>/backend/tsconfig.json",
    },
  },
};
