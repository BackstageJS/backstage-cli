import { execSync } from 'child_process'
import { CommanderStatic } from 'commander'
import * as fs from 'fs'
import * as request from 'request'
import * as tar from 'tar'

import { Config } from '../config-schema'
import { getConfig, handleError } from '../helpers'

const uploadStream = (file: string, key: string, callback?: request.RequestCallback) => {
  const uploadRequest = request.post(`${getConfig().server}/__backstage/deploy/${getConfig().app}/${key}`, callback)

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

const getDefaultBranchName = (): string | undefined => {
  try {
    return execSync('git rev-parse --abbrev-ref HEAD').toString().trim()
  } catch (e) {
    return undefined
  }
}

const deploy = (program: CommanderStatic) => {
  program
    .command('deploy')
    .option(
      '-k, --key <key>',
      'Specify the key to deploy (by default, the current Git branch name)',
      getDefaultBranchName(),
    )
    .action(command => {
      const file = `${getConfig().tempDirectory}/backstage-package-${new Date().toISOString()}.tar.gz`
      const key = command.key.replace(/\W/g, '-')
      const packageStream = tar.create({ cwd: getConfig().buildDirectory, file, gzip: true }, ['.'])
        .then(() => uploadStream(file, key, uploadCallback))
        .catch(handleError('There was an error when packaging your build directory:'))
    })
}

export default deploy
