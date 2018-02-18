#! /usr/bin/env node
import { execSync } from 'child_process'
import * as program from 'commander'
import * as fs from 'fs'
import * as rc from 'rc'
import * as request from 'request'
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
  .command('deploy')
  .option(
    '-k, --key <key>',
    'Specify the key to deploy (by default, the current Git branch name)',
    execSync('git rev-parse --abbrev-ref HEAD').toString().trim(),
  )
  .action(command => {
    const file = `${config.tempDirectory}/backstage-package-${new Date().toISOString()}.tar.gz`
    const key = command.key.replace(/\W/g, '-')
    const packageStream = tar.create({ cwd: config.buildDirectory, file, gzip: true }, ['.'])
      .then(() => uploadStream(file, key))
  })

program
  .version(packageJSON.version)
  .parse(process.argv)
