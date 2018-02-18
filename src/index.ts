#! /usr/bin/env node
import * as program from 'commander'
import * as fs from 'fs'
import * as rc from 'rc'
import * as request from 'request'
import { Readable } from 'stream'
import * as tar from 'tar'
const packageJSON = require('../package.json') // tslint:disable-line:no-var-requires

const config = rc('backstage', {
  tempDirectory: '/tmp',
})

const uploadStream = (file: string, key: string): request.Request => {
  const uploadRequest = request.post(`${config.server.baseURL}/${config.app}/${key}`)

  uploadRequest.form().append(
    'package',
    fs.createReadStream(file),
    { filename: 'package.tar.gz' },
  )

  return uploadRequest
}

program
  .command('deploy <key>')
  .action((key, command) => {
    const file = `${config.tempDirectory}/backstage-package-${new Date().getTime()}.tar.gz`
    const packageStream = tar.create({ cwd: config.buildDirectory, file, gzip: true }, ['.'])
      .then(() => uploadStream(file, key))
  })

program
  .version(packageJSON.version)
  .parse(process.argv)
