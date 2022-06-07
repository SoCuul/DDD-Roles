//Modules
import { MessageEmbed } from 'discord.js'
import { truncateString } from '../utils/misc.js'
import * as log from '../utils/log.js'
import * as dddRoleFuncs from '../utils/dddRoleFuncs.js'

export const name = 'interactionCreate'

export const execute = async (client, i) => {
    //Check for role commands
    if ((i.isButton() || i.isSelectMenu()) && (i?.customId.startsWith('dew') || i?.customId.startsWith('sar'))) {
        try {
            if (i.customId === 'dew_role') return await dddRoleFuncs.dewRole(client, i)
            else if (i.customId === 'dew_selected_colour') return await dddRoleFuncs.dewSelectedColour(client, i)
            else if (i.customId.startsWith('dew_selected_flavour')) return await dddRoleFuncs.dewSelectedFlavour(client, i)

            else if (i.customId.startsWith('sar')) return await dddRoleFuncs.sar(client, i)
        }
        catch (error) {
            console.log(error)
        }
    }

    //Filter out non-commands
    if (!i.isCommand() && !i.isContextMenu()) return

    //Respond to non-guild commands
    if (!i.inGuild()) return await i.reply('You can only use commands in servers.')

    //Grab the command data from the client.commands map
    const cmd = client.commands.get(i.commandName)

    //Check if the command does not exist
    if (!cmd) return await i.reply('That command doesn\'t exist!\nTry running the command again later.')

    //Run the command
    try {
        await cmd.execute(client, i)
    }
    catch (error) {
        console.log(log.error('Execution Error'))
        console.log(error)

        //Send embed
        const embed = new MessageEmbed()
            .setColor('RED')
            .setTitle('Execution Error')
            .setDescription('There was an error running the command.')
            .addField('Error', truncateString(error.toString(), 1021))
            .setTimestamp()

        return await i.channel.send({
            embeds: [ embed ]
        })
    }
}