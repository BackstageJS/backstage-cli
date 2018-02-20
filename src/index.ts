#! /usr/bin/env node
import { execSync } from 'child_process'
import * as program from 'commander'
import * as fs from 'fs'
import * as request from 'request'
import * as tar from 'tar'

import * as packageJSON from '../package.json'
import init from './commands/init'
import { getConfig, handleError } from './helpers'

const config = getConfig()

const uploadStream = (file: string, key: string, callback?: request.RequestCallback) => {
  const uploadRequest = request.post(`${config.server}/${config.app}/${key}`, callback)

  uploadRequest.form().append(
    'package',
    fs.createReadStream(file),
    { filename: 'package.tar.gz' },
  )
}

const uploadCallback = (error: any, response: request.Response, body: any) => {
  if (error) {
    handleError('There was an error uploading your package:')(error)
  }

  try {
    const { message } = JSON.parse(body)
    console.log(message) // tslint:disable-line:no-console
  } catch (error) {
    handleError('There was an error parsing the response from the server:')(error)
  }
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
      .catch(handleError('There was an error when packaging your build directory:'))
  })

init(program)

program
  .version(packageJSON.version)
  .parse(process.argv)
