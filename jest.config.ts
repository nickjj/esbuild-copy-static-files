import { Config } from '@jest/types'

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  collectCoverage: true,
  coverageReporters: ['text'],
}

export default config
