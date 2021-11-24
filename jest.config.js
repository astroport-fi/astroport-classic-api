module.exports = {
  testMatch: ['**/__tests__/**/*.test.ts?(x)'],
  coverageReporters: ['json', 'text', 'html', 'clover'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  testPathIgnorePatterns: ['/node_modules/', '<rootDir>/.build/'],
  modulePathIgnorePatterns: ['<rootDir>/.build/'],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga|css|svg)$':
      'identity-obj-proxy',
  },
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  testURL: 'http://localhost/',
  transform: {
    '^.+\\.[t|j]sx?$': 'ts-jest',
  },
};
