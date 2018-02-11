#! /usr/bin/env node
import * as program from 'commander'
const packageJSON = require('../package.json') // tslint:disable-line:no-var-requires

program
  .command('deploy')
  .option('-d, --directory <dir>', 'Specify the directory to deploy (default: `./build`)', './build')
  .action(command => {
    console.log(command.directory)
  })

program
  .version(packageJSON.version)
  .parse(process.argv)
