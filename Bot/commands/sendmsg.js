const Discord = require("discord.js")
function truncateString(str, num) {
    if (str.length <= num) {
        return str
    }
    return str.slice(0, num) + '...'
}

module.exports = {
    aliases: [],
    async run (client, message, args, sendError) {
        if(!message.mentions.channels.first()) return message.reply({
            embeds: [
                sendError('You have to mention a channel.', 'sendmsg <#channel> <flavour/sar>')
            ]
        })

        if (!args[1]) return message.reply({
            embeds: [
                sendError('You have to provide a type of message to send.', 'sendmsg <#channel> <flavour/sar>')
            ]
        })

        //Select which type of message to send
        switch (args[1]) {
            case 'flavour': {
                const embed = new Discord.MessageEmbed()
                .setColor('GREEN')
                .setTitle(client.msgs.getRole.title)
                .setDescription(client.msgs.getRole.description)

                try {
                    //Send message
                    await message.mentions.channels.first().send({
                        embeds: [ embed ],
                        components: [
                            new Discord.MessageActionRow()
                            .addComponents(
                                new Discord.MessageButton()
                                .setCustomId('dew_role')
                                .setLabel(client.msgs.getRole.buttonName)
                                .setStyle('PRIMARY')
                                .setEmoji(client.msgs.getRole.buttonEmoji)
                            )
                        ]
                    })

                    //React to original message
                    await message.react('✅')

                    break
                }
                catch (error) {
                    console.log(error)
                    message.reply('Could not send message to channel')

                    break
                }
            }
            case 'sar': {
                const embed = new Discord.MessageEmbed()
                .setColor('GREEN')
                .setTitle('Assign Your Own Roles')
                .addField(client.msgs.selfAssignRoles.aboutTitle, client.msgs.selfAssignRoles.aboutDescription)
                .addField(client.msgs.selfAssignRoles.section1Title, client.msgs.selfAssignRoles.section1Description)
                .addField(client.msgs.selfAssignRoles.section2Title, client.msgs.selfAssignRoles.section2Description)
                .addField(client.msgs.selfAssignRoles.section3Title, client.msgs.selfAssignRoles.section3Description)
                .addField(client.msgs.selfAssignRoles.section4Title, client.msgs.selfAssignRoles.section4Description)
                .addField(client.msgs.selfAssignRoles.section5Title, client.msgs.selfAssignRoles.section5Description)

                let int = 0
                let buttons = []
                let currentData = []

                for (i in client.sar) {
                    //Check if button space is filled up
                    if (int > 5) continue
                    
                    //Get button info
                    for (j in client.sar[i]) {
                        if (currentData.length < 5) { 
                            if (client.sar[i][j].name && client.sar[i][j].role && client.sar[i][j].style) {
                                currentData.push({
                                    "type": 2,
                                    "label": truncateString(client.sar[i][j].name, 77),
                                    "emoji": client.sar[i][j].emoji ? truncateString(client.sar[i][j].emoji, 70) : '',
                                    "style": client.sar[i][j].style,
                                    "custom_id": `sar_${client.sar[i][j].role}`
                                })
                            }
                        }
                        else break
                    }

                    //Create button data
                    buttons.push(
                        {
                            "type": 1,
                            "components": currentData
                        }
                    )

                    //Clear temp button data
                    currentData = []

                    int++
                }

                try {
                    //Send message
                    await message.mentions.channels.first().send({
                        embeds: [ embed ],
                        components: buttons
                    })

                    //React to original message
                    await message.react('✅')

                    break
                }
                catch (error) {
                    console.log(error)
                    message.reply('Could not send message to channel')

                    break
                }
            }
            default: {
                message.reply({
                    embeds: [
                        sendError('Please enter a valid message type.', 'sendmsg <#channel> <flavour/sar>')
                    ]
                })
            }
        }
    }
};