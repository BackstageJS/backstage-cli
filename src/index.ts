#! /usr/bin/env node
import * as program from 'commander'
import * as request from 'request'
import { Readable } from 'stream'
import * as tar from 'tar'
const packageJSON = require('../package.json') // tslint:disable-line:no-var-requires

const uploadStream = (stream: Readable, key: string): request.Request => {
  const uploadRequest = request.post(`http://localhost:3000/app1/${key}`)
  uploadRequest.form().append('package', stream, { filename: 'package.tar.gz' })

  return uploadRequest
}

program
  .command('deploy <key>')
  .option('-d, --directory <dir>', 'Specify the directory to deploy (default: `./build`)', './build')
  .action((key, command) => {
    const packageStream = tar.create({ gzip: true }, [command.directory])
    uploadStream(packageStream, key)
      .on('complete', console.log)
      .on('error', console.error)
  })

program
  .version(packageJSON.version)
  .parse(process.argv)
