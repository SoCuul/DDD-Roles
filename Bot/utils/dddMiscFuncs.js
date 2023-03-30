//Modules
import { MessageEmbed } from 'discord.js'

export const requestSPUpdate = async (client, i) => {
    //Check for seller perms
    if (!i?.member?.roles?.cache.get('882989568465453120')) return

    //Send message to seller channel
    const sellerChannel = i.guild.channels.cache.get('895999377976475689')
    
    const embed = new MessageEmbed()
        .setColor('#e3fc02')
        .setTitle('Seller Page Update')
        .setDescription(i.fields.getTextInputValue('updateInfo')|| 'Please DM the seller for this information.')
        .addFields({ name: 'Seller', value: i?.member?.toString() })
        .setTimestamp()

    //Send message
    await sellerChannel.send({
        embeds: [ embed ]
    })

    //Send response
    await i.reply({
        content: `Your update request has been sent to: ${sellerChannel.toString()}\nPlease check back for updates.`,
        ephemeral: true
    })
}