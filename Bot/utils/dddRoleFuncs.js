//Modules
import { MessageEmbed, MessageActionRow, MessageSelectMenu } from 'discord.js'
import chunk from 'lodash.chunk'
import { truncateString } from '../utils/misc.js'
import * as log from '../utils/log.js'

export const dewRole = async (client, i) => {
    //Select menu options
    const options = [
        {
            label: 'Red',
            description: 'Select from a list of Red Dews.',
            value: 'red',
        },
        {
            label: 'Orange',
            description: 'Select from a list of Orange Dews.',
            value: 'orange',
        },
        {
            label: 'Yellow',
            description: 'Select from a list of Yellow Dews.',
            value: 'yellow',
        },
        {
            label: 'Green',
            description: 'Select from a list of Green Dews.',
            value: 'green',
        },
        {
            label: 'Blue',
            description: 'Select from a list of Blue Dews.',
            value: 'blue',
        },
        {
            label: 'Purple',
            description: 'Select from a list of Purple Dews.',
            value: 'purple',
        },
        {
            label: 'Pink',
            description: 'Select from a list of Pink Dews.',
            value: 'pink',
        },
        {
            label: 'White/Other',
            description: 'Select from a list of White or Other Dews.',
            value: 'whiteother',
        }
    ]

    try {
        const embed = new MessageEmbed()
            .setColor('GREEN')
            .setTitle(client.msgs.selectColour.title)
            .setDescription(client.msgs.selectColour.description)
            .setTimestamp()

        //Send response
        await i.reply({
            embeds: [ embed ],
            ephemeral: true,
            components: [
                new MessageActionRow()
                .addComponents(
                    new MessageSelectMenu()
                        .setCustomId('dew_selected_colour')
                        .setPlaceholder(client.msgs.selectColour.selectPlaceholder)
                        .addOptions(options)
                )
            ]
        })
    }
    catch (error) {
        console.log(log.error(`Could not complete dewRole for user: ${i?.user?.tag}`))
        console.log(error)
    }
}

export const dewSelectedColour = async (client, i) => {
    const [ colour ] = i.values

    //Ensure response from previous interaction
    if (colour) {
        //Retrieve flavour list
        const dewArray = client.flavours[colour.toLowerCase()]

        //Check for invalid colour
        if (!dewArray) {
            try {
                //Send response
                return await i.update({
                    ephemeral: true,
                    embeds: [
                        new MessageEmbed()
                            .setColor('RED')
                            .setTitle(client.msgs.selectColour.invalidColourTitle)
                            .setDescription(client.msgs.selectColour.invalidColourDescription)
                            .setTimestamp()
                    ]
                })
            }
            catch (error) {
                console.log(log.error(`Could not send invalid dewSelectedColour msg for user: ${i?.user?.tag}`))
                console.log(error)
            }
        }

        //Prepare select menus
        let flavourOptions = dewArray.map(flavourInfo => ({
            "label": truncateString(flavourInfo.name, 97),
            "description": flavourInfo.description ? truncateString(flavourInfo.description, 97) : '',
            "value": truncateString(flavourInfo.role, 97)
        }))

        //Chunk flavour menus
        flavourOptions = chunk(flavourOptions, 25)

        //Format flavour menus
        const flavourMenus = []

        for (const chunkedFlavourOptions in flavourOptions) {
            if (flavourMenus.length >= 5) break

            flavourMenus.push(
                new MessageActionRow()
                    .addComponents(
                        new MessageSelectMenu()
                            .setCustomId(`dew_selected_flavour_${flavourMenus.length}`)
                            .setPlaceholder(client.msgs.selectFlavour.selectPlaceholder + ` (pg. ${Number(chunkedFlavourOptions) + 1})`)
                            .addOptions(flavourOptions[chunkedFlavourOptions])
                    )
            )
        }

        //Send response
        try {
            const embed = new MessageEmbed()
                .setColor('GREEN')
                .setTitle(client.msgs.selectFlavour.title)
                .setDescription(client.msgs.selectFlavour.description)
                .setTimestamp()

            await i.update({
                embeds: [ embed ],
                ephemeral: true,
                components: flavourMenus
            })
        }
        catch (error) {
            console.log(log.error(`Could not complete dewSelectedColour for user: ${i?.user?.tag}`))
            console.log(error)
        }
    }
}

export const dewSelectedFlavour = async (client, i) => {
    //Check for valid data
    if (i.values?.[0]) {
        const rolePrefix = '·'
        const roleName = i.values[0]
        const errors = []

        try {
            //Get target role
            const role = i.guild.roles.cache.find(r => r.name === `${rolePrefix} ${roleName} ${rolePrefix}`)

            if (role) {
                //Remove previous role(s)
                let remRoleError = false
                try {
                    await i.member.roles.cache
                    .filter(r => r.name.startsWith(rolePrefix))
                    .forEach(r => {
                        i.member.roles.remove(r, 'DEW Roles')
                        .catch(e => {
                            if (remRoleError === false) {
                                errors.push('Could not remove all previous MTN Dew roles.')
                                remRoleError = true
                            }
                        })
                    })
                }
                catch (e) {
                    errors.push('Could not remove previous MTN Dew roles.')
                }

                //Give selected dew role
                try {
                    await i.member.roles.add(role, 'DEW Roles')
                }
                catch (e) {
                    errors.push('Could not give specified MTN Dew role.')
                }
            }
            else {
                errors.push(`Could not find the **${truncateString(roleName, 50)}** role.`)
            }

            //Send response
            try {
                const embed = new MessageEmbed()
                    .setColor('GREEN')
                    .setTitle(client.msgs.roleGiven.title)
                    .setDescription(errors.length ? `There was an error.\nYou may or may not have received the **${truncateString(roleName, 50)}** role.` : `You have received the **${i.values[0]}** role.`)
                    .setTimestamp()

                if(errors.length) embed.addFields({ name: 'Errors', value: errors.join('\n') })

                await i.update({
                    embeds: [ embed ],
                    ephemeral: true,
                    components: []
                })
            }
            catch (error) {
                console.log(log.error(`Could not complete dewSelectedFlavour for user: ${i?.user?.tag}`))
                console.log(error)
            }
        }
        catch (error) {
            console.log(log.error(`Could not complete dewSelectedFlavour for user: ${i?.user?.tag}`))
            console.log(error)
        }
    }
}

export const sar = async (client, i) => {
    const [ identifier, roleName ] = i.customId.split('sar_')

    //Check for valid data
    if (roleName) {
        const role = i.guild.roles.cache.find(r => r.name === roleName)

        if (role) {
            //Check if member has role
            if (i.member.roles.cache.some(r => r.name === roleName)) {
                try {
                    //Remove role from member
                    await i.member.roles.remove(role)

                    const embed = new MessageEmbed()
                        .setColor('GREEN')
                        .setTitle('Self Assign Roles')
                        .setDescription(`The **${truncateString(roleName, 50)}** role has been removed from your profile.`)
                        .setTimestamp()

                    //Send response
                    return await i.reply({
                        embeds: [ embed ],
                        ephemeral: true
                    })
                }
                catch (error) {
                    const embed = new MessageEmbed()
                        .setColor('GREEN')
                        .setTitle('Self Assign Roles')
                        .setDescription(`There was an error removing the **${truncateString(roleName, 50)}** role from your profile.`)
                        .setTimestamp()

                    //Send response
                    return await i.reply({
                        embeds: [ embed ],
                        ephemeral: true
                    })
                }
            }
            else {
                try {
                    //Give role to member
                    await i.member.roles.add(role)

                    const embed = new MessageEmbed()
                        .setColor('GREEN')
                        .setTitle('Self Assign Roles')
                        .setDescription(`You have received the **${truncateString(roleName, 50)}** role.`)
                        .setTimestamp()

                    //Send response
                    return await i.reply({
                        embeds: [ embed ],
                        ephemeral: true
                    })
                }
                catch (error) {
                    const embed = new MessageEmbed()
                        .setColor('GREEN')
                        .setTitle('Self Assign Roles')
                        .setDescription(`There was an error giving you the **${truncateString(roleName, 50)}** role.`)
                        .setTimestamp()

                    //Send response
                    return await i.reply({
                        embeds: [ embed ],
                        ephemeral: true
                    })
                }
            }
        }
        else {
            const embed = new MessageEmbed()
                .setColor('GREEN')
                .setTitle('Self Assign Roles')
                .setDescription(`The **${truncateString(roleName, 50)}** role could not be found.`)
                .setTimestamp()
            
            //Send response
            return await i.reply({
                embeds: [ embed ],
                ephemeral: true
            })
        }
    }
}