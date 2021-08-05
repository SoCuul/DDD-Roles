module.exports = {
    aliases: [],
    async run(client, message, args, sendError) {
        const Discord = require("discord.js");

        if(!message.mentions.channels.first()) return sendError('You have to mention a channel.||sendmsg <#channel>')

        const embed = new Discord.MessageEmbed()
        .setColor('GREEN')
        .setTitle(client.msgs.getRole.title)
        .setDescription(client.msgs.getRole.description)

        try{
            //Send message
            message.mentions.channels.first().send({
                embeds: [embed],
                components: [
                    new Discord.MessageActionRow()
                    .addComponents(
                        new Discord.MessageButton()
                        .setCustomId('dew_role')
                        .setLabel(client.msgs.getRole.buttonName)
                        .setStyle('PRIMARY')
                        .setEmoji(client.msgs.getRole.buttonEmoji),
                    )
                ]
            })

            //React to original message
            message.react('✅')
        }
        catch(error){
            console.log(error)
            message.reply('Could not send message to channel')
        }
    }
};