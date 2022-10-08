//Modules
import { MessageEmbed } from 'discord.js'

export const info = {
    name: 'puppo',
    description: 'Get a photo of a random amazon dog.',
}

export const execute = async (client, i) => {
    const colours = ['WHITE', 'AQUA', 'GREEN', 'BLUE', 'YELLOW', 'PURPLE', 'GOLD', 'ORANGE', 'RED', 'BLURPLE']
    const embedColour = colours[ Math.floor(Math.random() * colours.length) ]

    const dogNumber = Math.floor(Math.random() * (200 - 1 + 1)) + 1

    //Create embed
    const embed = new MessageEmbed()
        .setColor(embedColour || 'GOLD')
        .setTitle('Heres ur puppo')
        .setImage(`https://images-na.ssl-images-amazon.com/images/G/01/error/en_US/${dogNumber}._TTD_.jpg`)

    //Send response
    await i.reply({
        embeds: [ embed ],
        ephemeral: true
    })
}