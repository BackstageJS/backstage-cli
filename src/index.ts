#! /usr/bin/env node
import * as program from 'commander'
import * as fs from 'fs'
import * as request from 'request'
import { Readable } from 'stream'
import * as tar from 'tar'
const packageJSON = require('../package.json') // tslint:disable-line:no-var-requires

const uploadStream = (file: string, key: string): request.Request => {
  const uploadRequest = request.post(`http://localhost:3000/app1/${key}`)
  uploadRequest.form().append(
    'package',
    fs.createReadStream(file),
    { filename: 'package.tar.gz' },
  )

  return uploadRequest
}

program
  .command('deploy <key>')
  .option('-d, --directory <dir>', 'Specify the directory to deploy (default: `./build`)', './build')
  .action((key, command) => {
    const file = `/tmp/backstage-deploy-${new Date().getTime()}.tar.gz`
    const packageStream = tar.create({ cwd: command.directory, file, gzip: true }, ['.'])
      .then(() => uploadStream(file, key))
  })

program
  .version(packageJSON.version)
  .parse(process.argv)
