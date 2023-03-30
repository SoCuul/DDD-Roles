//Modules
import { random, truncateString } from '../utils/misc.js'

//Message prefixes
const shopPrefix = ['wtb', 'wtt', 'wts']

export const name = 'messageCreate'

export const execute = async (client, message) => {
    try {
        //Check if message is in a buy/trade/sell channel
        if (message?.channel?.name?.toLowerCase()?.includes('buy-trade-sell')) {
            //Check if message includes required prefix
            if (shopPrefix.every(prefix => !message?.content?.toLowerCase().startsWith(prefix))) {
                //Notify user
                try {
                    await message?.author?.send(`
>>> Hey DEWd!
To post in a shop channel, your message must start with **WTS** (Sell), **WTB** (Buy) or **WTT** (Trade), depending on your intentions.
For more information, please visit: <#994699935603765318>

**Your message:**
\`\`\`
${message?.content ? truncateString(message.content, 1500) : 'No message sent'}
\`\`\`
                    `)
                }
                catch (e) {}
                
                //Delete message
                try {
                    await message.delete()
                }
                catch (e) {}

                return
            }
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