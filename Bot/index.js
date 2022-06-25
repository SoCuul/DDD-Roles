//Modules
import Discord from 'discord.js'
import recursive from 'recursive-readdir'
import 'dotenv/config'

import * as log from './utils/log.js'
import * as fetchConfigData from './utils/fetchConfigData.js'
import * as config from './config.js'

//Check for required variables
if (!process.env.TOKEN) {
    console.log(log.error('No token was found in ".env". Please enter one and try again.'))
    process.exit(1)
}

//Create client
const client = new Discord.Client({
    intents: config?.intents,
    allowedMentions: { repliedUser: false }
})
client.config = config

//Retrieve configuration files
if (client.config.localConfig) await fetchConfigData.local(client)
else await fetchConfigData.external(client)

console.log('')

//Load events
import { loadEvents } from './utils/loadFiles.js'

let eventsInfo = await recursive('./events/')
eventsInfo?.filter(path => path.endsWith('.js'))

await loadEvents(eventsInfo, client, true)

//Load commands
client.commands = new Discord.Collection()

let commandsInfo = await recursive('./commands/')
commandsInfo?.filter(path => path.endsWith('.js'))

import { loadCommands } from './utils/loadFiles.js'

await loadCommands(client.commands, commandsInfo, true)

//Client Login
console.log('')

try {
    await client.login(process.env.TOKEN)
}
catch (error) {
    console.log(log.error('Could not login. Please make sure the token is valid.'))
    console.log(error)

    process.exit(1)
}