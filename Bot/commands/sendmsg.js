module.exports = {
    aliases: [],
    async run(client, message, args, sendError) {
        const Discord = require("discord.js");

        if(!message.mentions.channels.first()) return sendError('You have to mention a channel.||sendmsg <#channel>')

        const embed = new Discord.MessageEmbed()
        .setColor('GREEN')
        .setTitle('Grab a Dew Role')
        .setDescription('Click the button below to grab a role representing your favourite dew!')

        try{
            //Send message
            message.mentions.channels.first().send({
                embeds: [embed],
                components: [
                    new Discord.MessageActionRow()
                    .addComponents(
                        new Discord.MessageButton()
                        .setCustomId('dew_role')
                        .setLabel('Get a Dew role')
                        .setStyle('PRIMARY')
                        .setEmoji('616461782839590938'),
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