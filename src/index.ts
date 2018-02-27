#! /usr/bin/env node
import * as program from 'commander'

import * as packageJSON from '../package.json'
import deploy from './commands/deploy'
import init from './commands/init'
import { Config } from './config-schema'

deploy(program)
init(program)

program
  .version(packageJSON.version)
  .parse(process.argv)
