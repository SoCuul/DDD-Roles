//Modules
import { random } from '../utils/misc.js'

export const name = 'messageCreate'

export const execute = async (client, message) => {
    try {
        //Respond to pitch black msgs
        if (message?.content?.toLowerCase()?.match('((tastes|taste) like ((pitch black)|pb))')) {
            await message.react('997376586800168990')
        }

        //Respond on ping
        if (message.mentions.users.first()?.id === client.user.id) {
            await message.channel.send(
                random(client.msgs.randomMessages)
            )
        }
    }
    catch (error) {
        console.log(error)
    }
}