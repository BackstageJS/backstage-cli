#! /usr/bin/env node
import { execSync } from 'child_process'
import * as program from 'commander'
import * as fs from 'fs'
import * as request from 'request'
import * as tar from 'tar'

import { getConfig } from './helpers'
const packageJSON = require('../package.json') // tslint:disable-line:no-var-requires

const config = getConfig()

const uploadStream = (file: string, key: string, callback?: request.RequestCallback): request.Request => {
  const uploadRequest = request.post(`${config.server}/${config.app}/${key}`, callback)

  uploadRequest.form().append(
    'package',
    fs.createReadStream(file),
    { filename: 'package.tar.gz' },
  )

  return uploadRequest
}

const uploadCallback = (error: any, response: request.Response, body: any) => {
  const { message } = JSON.parse(body)
  console.log(message) // tslint:disable-line:no-console
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
      .then(() => uploadStream(file, key, uploadCallback))
      .catch(error => {
        console.error('There was an error when packaging your build directory:') // tslint:disable-line:no-console
        console.error(error) // tslint:disable-line:no-console
      })
  })

program
  .version(packageJSON.version)
  .parse(process.argv)
