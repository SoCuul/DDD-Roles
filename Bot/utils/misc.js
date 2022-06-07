//Modules
import { MessageEmbed } from 'discord.js'

export const random = arr => arr[Math.floor(Math.random() * arr.length)]

export const wait = ms => new Promise(resolve => setTimeout(resolve, ms))

export const sendError = (client, input, title, color) => {
    if (!input) return
    
    return new MessageEmbed()
    .setColor(color || 'RED')
    .setTitle(title || 'Error')
    .setDescription(input)
    .setFooter({
        text: client.user.username,
        iconURL: client.user.displayAvatarURL({ dynamic: true })
    })
}

export const truncateString = (str, num, suffix) => {
    if (str.length <= num) {
        return str
    }
    return str.slice(0, num) + suffix || '...'
}