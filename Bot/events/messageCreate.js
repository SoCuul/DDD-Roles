//Modules
import { random } from '../utils/misc.js'

export const name = 'messageCreate'

export const execute = async (client, message) => {
    try {
        //Check if message is in a buy/trade/sell channel
        if (message?.channel?.name?.toLowerCase()?.includes('buy-trade-sell')) {
            //Check if message includes required prefix
            if (!message?.content?.toLowerCase()?.startsWith('wtb') && !message?.content?.toLowerCase()?.startsWith('wtt') && !message?.content?.toLowerCase()?.startsWith('wts')) {
                //Delete message
                try {
                    await message.delete()
                }
                catch (error) {
                    console.log(error)
                }

                return
            }
        }

        //Respond to pitch black msgs
        if (message?.content?.toLowerCase()?.match('((tastes|taste|tasted) like ((pitch black)|pb|(mtn dew pitch black)|(mtn dew pb)|(mountain dew pitch black)|(mountain dew pb)))')) {
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