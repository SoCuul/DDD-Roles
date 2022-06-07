//Modules
import { random } from '../utils/misc.js'

export const name = 'messageCreate'

export const execute = async (client, message) => {
    //Respond on ping
    try {
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