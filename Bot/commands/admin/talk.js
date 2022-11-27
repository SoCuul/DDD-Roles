//Modules
import { MessageEmbed } from 'discord.js'
import { sendError } from '../../utils/misc.js'
import * as log from '../../utils/log.js'

export const info = {
    name: 'talk',
    description: 'Become broctopus (or something like that).',
    options: [
        {
            type: 7,
            name: 'channel',
            description: 'The channel you\'d like to send the message to',
            required: true,
        },
        {
            type: 3,
            name: 'message',
            description: 'Whatchu wanna say',
            required: true
        }
    ]
}

export const execute = async (client, i) => {
    const channel = i.options.getChannel('channel')
    const message = i.options.getString('message')

    //Check permission
    if (!client.config.staff.includes(i?.user?.id)) return

    //Check valid channel type
    if (channel?.type !== 'GUILD_TEXT' && channel?.type !== 'GUILD_NEWS' && channel?.type !== 'GUILD_NEWS_THREAD' && channel?.type !== 'GUILD_PUBLIC_THREAD'&& channel?.type !== 'GUILD_PRIVATE_THREAD') {
        return await i.reply({
            embeds: [
                sendError(client, 'Please select a valid channel type.')
            ]
        })
    }

    try {
        //Send message
        await channel.send(message)

        const responseEmbed = new MessageEmbed()
            .setColor('GREEN')
            .setTitle('Message sent')
            .setDescription(`Sent your message to: ${channel?.toString()}\n\nMessage:\n\`\`\`\n${message}\n\`\`\``)
            .setTimestamp()

        //Send response
        await i.reply({
            embeds: [ responseEmbed ],
            ephemeral: true
        })
    }
    catch (error) {
        console.log(log.error(`Could not send talk message to channel: "${channel?.id}"`))
        console.log(error)

        //Send response
        try {
            await i.reply({
                embeds: [
                    sendError(client, `Could not send your message to: ${channel?.toString()}\n\nMessage:\n\`\`\`\n${message}\n\`\`\``)
                ],
                ephemeral: true
            })
        }
        catch (error) {}
    }
}