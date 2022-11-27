//Modules
import { MessageEmbed, MessageActionRow, MessageButton } from 'discord.js'
import chunk from 'lodash.chunk'
import { truncateString, sendError } from '../../utils/misc.js'
import * as log from '../../utils/log.js'

export const info = {
    name: 'sendmsg',
    description: 'Send a role prompt message.',
    options: [
        {
            type: 7,
            name: 'channel',
            description: 'The channel you\'d like to send the message to',
            required: true,
        },
        {
            type: 3,
            name: 'type',
            description: 'The type of message you would like to send',
            choices: [
                {
                    name: 'Change Your Flavour',
                    value: 'flavour'
                },
                {
                    name: 'Self-Assign Roles',
                    value: 'sar'
                }
            ],
            required: true
        }
    ]
}

export const execute = async (client, i) => {
    const channel = i.options.getChannel('channel')
    const type = i.options.getString('type')

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

    //Check for message types
    switch (type.toLowerCase()) {
        case 'flavour': {
            try {
                //Defer reply
                await i.deferReply()
                
                const embed = new MessageEmbed()
                    .setColor('GREEN')
                    .setTitle(client.msgs.getRole.title)
                    .setDescription(client.msgs.getRole.description)

                //Send message
                await channel.send({
                    embeds: [ embed ],
                    components: [
                        new MessageActionRow()
                            .addComponents(
                                new MessageButton()
                                    .setCustomId('dew_role')
                                    .setLabel(client.msgs.getRole.buttonName)
                                    .setStyle('PRIMARY')
                                    .setEmoji(client.msgs.getRole.buttonEmoji)
                            )
                    ]
                })

                const responseEmbed = new MessageEmbed()
                    .setColor('GREEN')
                    .setTitle('Send Message')
                    .setDescription(`Message sent to: ${channel?.toString()}`)
                    .setTimestamp()

                //Send response
                await i.editReply({
                    embeds: [ responseEmbed ]
                })
            }
            catch (error) {
                console.log(log.error(`Could not send requested message to channel: "${channel?.id}"`))
                console.log(error)

                //Send response
                try {
                    await i.reply({
                        embeds: [
                            sendError(client, 'Could not send message.')
                        ]
                    })
                }
                catch (error) {}
            }

            break
        }
        case 'sar': {
            try {
                //Defer reply
                await i.deferReply()
                
                const embed = new MessageEmbed()
                    .setColor('GREEN')
                    .setTitle('Assign Your Own Roles')
                    .addField(client.msgs.selfAssignRoles.aboutTitle, client.msgs.selfAssignRoles.aboutDescription)
                    .addField(client.msgs.selfAssignRoles.section1Title, client.msgs.selfAssignRoles.section1Description)
                    .addField(client.msgs.selfAssignRoles.section2Title, client.msgs.selfAssignRoles.section2Description)
                    .addField(client.msgs.selfAssignRoles.section3Title, client.msgs.selfAssignRoles.section3Description)
                    .addField(client.msgs.selfAssignRoles.section4Title, client.msgs.selfAssignRoles.section4Description)
                    .addField(client.msgs.selfAssignRoles.section5Title, client.msgs.selfAssignRoles.section5Description)

                
                //Prepare button lists
                const buttonsData = []

                for (const sarSection of client.sar) {
                    //Format data
                    let sarData = sarSection.map(sarInfo => ({
                        "type": 2,
                        "label": truncateString(sarInfo.name, 77),
                        "emoji": sarInfo.emoji ? truncateString(sarInfo.emoji, 70) : '',
                        "style": sarInfo.style,
                        "custom_id": `sar_${sarInfo.role}`
                    }))

                    //Chunk data
                    sarData = chunk(sarData, 5)[0]

                    buttonsData.push(sarData)
                }

                //Send message
                await channel.send({
                    embeds: [ embed ],
                    components: chunk(
                        buttonsData.map(sarData => ({
                            "type": 1,
                            "components": sarData
                        }))
                    , 5)[0]
                })

                const responseEmbed = new MessageEmbed()
                    .setColor('GREEN')
                    .setTitle('Send Message')
                    .setDescription(`Message sent to: ${channel?.toString()}`)
                    .setTimestamp()

                //Send response
                await i.editReply({
                    embeds: [ responseEmbed ]
                })
            }
            catch (error) {
                console.log(log.error(`Could not send requested message to channel: "${channel?.id}"`))
                console.log(error)

                //Send response
                try {
                    await i.reply({
                        embeds: [
                            sendError(client, 'Could not send message.')
                        ]
                    })
                }
                catch (error) {}
            }

            break
        }
        default: {
            await i.reply({
                embeds: [
                    sendError(client, 'Please select a valid message type.')
                ]
            })
        }
    }
}