//Modules
import * as log from '../utils/log.js'

import { random } from '../utils/misc.js'

export const name = 'ready'

export const once = true

export const execute = async (client) => {
    //Online message
    console.log(log.success(`${client.user.tag} is online.`))
    console.log(log.info(`${client.guilds.cache.size} servers`))
    console.log(log.info(`${client.guilds.cache.reduce((a, c) => a + c.memberCount, 0)} users`))

    async function setStatus () {
        try {
            await client.user.setPresence({
                activities: [
                    random(client.config.presences(client).activities)
                ],
                status: client.config.presences.status
            })
        }
        catch (error) {
            console.log(log.error('Could not set status.'))
            console.log(error)
        }
    }

    //Set first status
    await setStatus()

    //Set status on intervals
    await setInterval(setStatus, client.config.presences(client).switchActivityInterval)
}