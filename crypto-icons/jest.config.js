module.exports = {
  roots: ["<rootDir>/src"],
  moduleFileExtensions: ["ts", "tsx", "js"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testEnvironment: "jsdom",
  testMatch: ["**/*.test.(ts|tsx)"],
};
