#! /usr/bin/env node
import * as program from 'commander'
import * as request from 'request'
import * as tar from 'tar'
const packageJSON = require('../package.json') // tslint:disable-line:no-var-requires

program
  .command('deploy <key>')
  .option('-d, --directory <dir>', 'Specify the directory to deploy (default: `./build`)', './build')
  .action((key, command) => {
    tar.create({ gzip: true }, [command.directory]).pipe(
      request.post(`http://localhost:3000/app1/${key}`),
    )
  })

program
  .version(packageJSON.version)
  .parse(process.argv)
