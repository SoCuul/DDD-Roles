//Modules
import { MessageEmbed } from 'discord.js'
import { sendError } from '../utils/misc.js'
import { external } from '../utils/fetchConfigData.js'

export const info = {
    name: 'reloaddata',
    description: 'Reload the internal configuration files.',
}

export const execute = async (client, i) => {
    //Check permission
    if (!client.config.staff.includes(i?.user?.id)) return

    await i.deferReply()

    //Reload config data
    const status = await external(client)

    //Check for errors
    if (status) {
        await i.editReply({
            embeds: [
                new MessageEmbed()
                    .setColor('GREEN')
                    .setTitle('Reload Data')
                    .setDescription('Configuration files have been reloaded.')
                    .setTimestamp()
            ]
        })
    } 
    else {
        await i.editReply({
            embeds: [
                sendError(client, 'There was an error reloading the configuration files.\nPlease check the console for more info.')
            ]
        })
    }
}