const Discord = require("discord.js")
function truncateString(str, num) {
    if (str.length <= num) {
        return str
    }
    return str.slice(0, num) + '...'
}

module.exports = async (client, i) => {
    //Verify interaction source
    if (!i.guild || !i.member) return

    //Check for dew_role button
    if (i.customId.startsWith('dew_role')) {
        //Send colour prompt
        try {
            const colourEmbed = new Discord.MessageEmbed()
            .setColor('GREEN')
            .setTitle(client.msgs.selectColour.title)
            .setDescription(client.msgs.selectColour.description)
            .setTimestamp()
            await i.reply({
                embeds: [colourEmbed],
                ephemeral: true,
                components: [
                    new Discord.MessageActionRow()
                    .addComponents(
                        new Discord.MessageSelectMenu()
                        .setCustomId('dew_select_colour')
                        .setPlaceholder(client.msgs.selectColour.selectPlaceholder)
                        .addOptions([
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
                                label: 'White/Clear',
                                description: 'Select from a list of White or Clear Dews.',
                                value: 'whiteclear',
                            },
                        ]),
                    )
                ]
            })
        }
        catch (error) {
            console.log('Could not respond to dew_role interaction')
        }
    }
    
    //Check for dew_select_colour button
    else if (i.customId.startsWith('dew_select_colour')) {
        if (i.values || i.values[0]) {
            //Dew flavours array
            let dewArray = client.flavours[i.values[0].toLowerCase()]

            //Check for invalid colour
            if (!dewArray) {
                try {
                    return await i.update({
                        embeds: [
                            new Discord.MessageEmbed()
                            .setColor('RED')
                            .setTitle(client.msgs.selectColour.invalidColourTitle)
                            .setDescription(client.msgs.selectColour.invalidColourDescription)
                            .setTimestamp()
                        ]
                    })
                }
                catch (error) {
                    console.log('Could not respond to dew_select_colour interaction for invalid colour')
                }
            }

            //Prepare dew select menu
            let dewMenus = [[], [], [], [], []]
            for (j in dewArray) {
                if (!isNaN(Number(j)) && Number.isInteger(Number(j)) && Number(j) < 6) {
                    for (k in dewArray[j]) {
                        let currentMenu = Number(j) - 1
                        
                        if (dewMenus[currentMenu].length < 25) {
                            if (dewArray[j][k].name && dewArray[j][k].role) {
                                dewMenus[currentMenu].push({
                                    "label": truncateString(dewArray[j][k].name, 97),
                                    "description": dewArray[j][k].description ? truncateString(dewArray[j][k].description, 97) : '',
                                    "value": dewArray[j][k].role
                                })
                            }
                        }
                        else break
                    }
                }
                else continue
            }

            //Prepare prompt menus
            let selects = []
            for (j in dewMenus) {
                if (dewMenus[j].length) {
                    selects.push(
                        new Discord.MessageActionRow()
                        .addComponents(
                            new Discord.MessageSelectMenu()
                            .setCustomId(`dew_select_flavour_${j}`)
                            .setPlaceholder(client.msgs.selectFlavour.selectPlaceholder)
                            .addOptions(dewMenus[j]),
                        )
                    )
                }
            }

            //Send flavour prompt(s)
            try {
                const flavourEmbed = new Discord.MessageEmbed()
                .setColor('GREEN')
                .setTitle(client.msgs.selectFlavour.title)
                .setDescription(client.msgs.selectFlavour.description)
                .setTimestamp()
                await i.update({
                    embeds: [flavourEmbed],
                    ephemeral: true,
                    components: selects
                })
            }
            catch (error) {
                console.log(error)
                console.log('Could not respond to dew_select_colour interaction')
            }
        }
        else {
            return
        }
    }

    //Check for dew_select_flavour button
    else if (i.customId.startsWith('dew_select_flavour')) {
        if (i.values || i.values[0]) {
            const rolePrefix = '·'
            let errors = []

            //Give dew role
            try {
                const role = i.guild.roles.cache.find(r => r.name === `${rolePrefix} ${i.values[0]} ${rolePrefix}`)
                if (role) {
                    //Remove previous role(s)
                    let remRoleError = false
                    try {
                        //Deal with roles
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

                    //Give new dew role
                    try {
                        await i.member.roles.add(role, 'DEW Roles')
                    }
                    catch (e) {
                        errors.push('Could not give specified MTN Dew role.')
                    }
                }
                else {
                    errors.push(`Could not find the **${truncateString(i.values[0], 50)}** role.`)
                }
            }
            catch (e) {
                errors.push('Could not complete the role assigning process.')
            }

            //Send flavour prompt(s)
            try {
                const embed = new Discord.MessageEmbed()
                .setColor('GREEN')
                .setTitle(client.msgs.roleGiven.title)
                .setDescription(errors.length ? `There was an error.\nYou may or may not have received the **${truncateString(i.values[0], 50)}** role.` : `You have received the **${i.values[0]}** role.`)
                .setTimestamp()
                if(errors.length) embed.addField('Errors', errors.join('\n'))
                return await i.update({
                    embeds: [embed],
                    ephemeral: true,
                    components: []
                })
            }
            catch (error) {
                console.log('Could not respond to dew_select_flavour interaction')
            }
        }
        else {
            return
        }
    }

    //Self Assign Roles
    else if (i.customId.startsWith('sar_')) {
        const customID = i.customId.split('sar_')
        
        if (customID.length >= 2) {
            const roleName = customID[1]
            const role = i.guild.roles.cache.find(r => r.name === roleName)

            if (role) {
                //Check if member has role
                if (i.member.roles.cache.some(r => r.name === roleName)) {
                    try {
                        //Remove role from member
                        await i.member.roles.remove(role)

                        //Send response
                        const embed = new Discord.MessageEmbed()
                        .setColor('GREEN')
                        .setTitle('Self Assign Roles')
                        .setDescription(`The **${truncateString(roleName, 50)}** role has been removed from your profile.`)
                        .setTimestamp()
                        return await i.reply({
                            embeds: [embed],
                            ephemeral: true
                        })
                    }
                    catch (error) {
                        //Send response
                        const embed = new Discord.MessageEmbed()
                        .setColor('GREEN')
                        .setTitle('Self Assign Roles')
                        .setDescription(`There was an error removing the **${truncateString(roleName, 50)}** role from your profile.`)
                        .setTimestamp()
                        return await i.reply({
                            embeds: [embed],
                            ephemeral: true
                        })
                    }
                }
                else {
                    try {
                        //Give role to member
                        await i.member.roles.add(role)

                        //Send response
                        const embed = new Discord.MessageEmbed()
                        .setColor('GREEN')
                        .setTitle('Self Assign Roles')
                        .setDescription(`You have received the **${truncateString(roleName, 50)}** role.`)
                        .setTimestamp()
                        return await i.reply({
                            embeds: [embed],
                            ephemeral: true
                        })
                    }
                    catch (error) {
                        //Send response
                        const embed = new Discord.MessageEmbed()
                        .setColor('GREEN')
                        .setTitle('Self Assign Roles')
                        .setDescription(`There was an error giving you the **${truncateString(roleName, 50)}** role.`)
                        .setTimestamp()
                        return await i.reply({
                            embeds: [embed],
                            ephemeral: true
                        })
                    }
                }
            }
            else {
                const embed = new Discord.MessageEmbed()
                .setColor('GREEN')
                .setTitle('Self Assign Roles')
                .setDescription(`The **${truncateString(roleName, 50)}** role could not be found.`)
                .setTimestamp()
                return await i.reply({
                    embeds: [embed],
                    ephemeral: true
                })
            }
        }
    }
};
