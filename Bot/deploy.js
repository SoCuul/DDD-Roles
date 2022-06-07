//Modules
import { REST } from '@discordjs/rest'
import { Routes } from 'discord-api-types/v9'
import recursive from 'recursive-readdir'

import * as log from './utils/log.js'

const devServer = process.argv[2]

//Required variables
import 'dotenv/config'

if (!process.env.TOKEN) {
    console.log(log.error('No token was found in ".env". Please enter one and try again.'))
    process.exit(1)
}
if (!process.env.CLIENTID) {
    console.log(log.error('No client id was found in ".env". Please enter one and try again.'))
    process.exit(1)
}

console.log(log.info('Loading commands...'))

//Load command info
const commandsInfo = await recursive('./commands/')

import { getCommandsInfo } from './utils/loadFiles.js'

const commands = await getCommandsInfo(commandsInfo)

console.log(log.info(`Loaded ${commands.length} command(s)!`))

//Deploy commands
console.log('')

if (devServer) console.log(log.info(`Deploying commands to: ${devServer}...`))
else console.log(log.info('Deploying global commands...'))

const rest = new REST({ version: '9' }).setToken(process.env.TOKEN)

try {
    if (devServer) {
        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENTID, devServer),
            { body: commands }
        )
    }
    else {
        await rest.put(
            Routes.applicationCommands(process.env.CLIENTID),
            { body: commands }
        )
    }

    console.log(log.success('Commands successfully deployed!'))
    process.exit(0)
}
catch (error) {
    console.log(log.error('There was an error deploying the commands.'))
    console.log(error)
}