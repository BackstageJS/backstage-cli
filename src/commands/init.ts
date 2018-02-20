import { CommanderStatic } from 'commander'
import { writeFileSync } from 'fs'
import * as inquirer from 'inquirer'

const getDefaultName = () => {
  try {
    const appPackageJSON = require(process.cwd() + '/package.json')
    return appPackageJSON && appPackageJSON.name
  } catch (e) {
    return null
  }
}

const init = (program: CommanderStatic) => {
  program
    .command('init')
    .action(async () => {
      const answers = await inquirer.prompt([
        {
          default: getDefaultName,
          message: 'Your app name',
          name: 'app',
          validate: value => Boolean(value.trim()),
        },
        {
          default: 'build',
          message: "Your app's build directory",
          name: 'buildDirectory',
          validate: value => Boolean(value.trim()),
        },
        {
          default: '/tmp',
          message: 'Temp directory to use when packaging deploys',
          name: 'tempDirectory',
          validate: value => Boolean(value.trim()),
        },
        {
          message: "Your Backstage server's base URL (ex: 'http://backstage.example.com')",
          name: 'server',
          validate: value => Boolean(value.trim()),
        },
      ])

      writeFileSync(process.cwd() + '/.backstagerc', JSON.stringify(answers, null, 2))
    })
}

export default init
