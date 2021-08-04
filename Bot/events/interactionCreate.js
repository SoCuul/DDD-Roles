module.exports = async (client, i) => {
    const Discord = require("discord.js");

    function truncateString(str, num) {
        if (str.length <= num) {
            return str
        }
        return str.slice(0, num) + '...'
    }

    //Check for dew_role button
    if(i.customId === 'dew_role'){
        //Send colour prompt
        try{
            const colourEmbed = new Discord.MessageEmbed()
            .setColor('GREEN')
            .setTitle('Select a colour')
            .setDescription('Which colour is the Mountain Dew you want to pick?')
            .setTimestamp()
            i.reply({
                embeds: [colourEmbed],
                ephemeral: true,
                components: [
                    new Discord.MessageActionRow()
                    .addComponents(
                        new Discord.MessageSelectMenu()
                        .setCustomId('dew_select_colour')
                        .setPlaceholder('Select a dew colour')
                        .addOptions([
                            {
                                label: 'Red',
                                description: 'Select from a list of red dews.',
                                value: 'red',
                            },
                            {
                                label: 'Orange',
                                description: 'Select from a list of orange dews.',
                                value: 'orange',
                            },
                            {
                                label: 'Yellow',
                                description: 'Select from a list of yellow dews.',
                                value: 'yellow',
                            },
                            {
                                label: 'Green',
                                description: 'Select from a list of green dews.',
                                value: 'green',
                            },
                            {
                                label: 'Blue',
                                description: 'Select from a list of blue dews.',
                                value: 'blue',
                            },
                            {
                                label: 'Purple',
                                description: 'Select from a list of purple dews.',
                                value: 'purple',
                            },
                            {
                                label: 'Pink',
                                description: 'Select from a list of pink dews.',
                                value: 'pink',
                            },
                            {
                                label: 'White/Clear',
                                description: 'Select from a list of white/clear dews.',
                                value: 'whiteclear',
                            },
                        ]),
                    )
                ]
            })
        }
        catch(error){
            console.log('Could not respond to dew_role interaction')
        }
    }
    
    //Check for dew_select_colour button
    if(i.customId === 'dew_select_colour'){
        if(i.values || i.values[0]){
            //Dew flavours array
            let dewArray = client.flavours[i.values[0]]

            //Check for invalid colour
            if(!dewArray){
                try{
                    return i.update({
                        embeds: [
                            new Discord.MessageEmbed()
                            .setColor('RED')
                            .setTitle('Invalid Colour')
                            .setDescription('The colour you selected is currently invalid.\nPlease try again later, or select a different dew colour.')
                            .setTimestamp()
                        ]
                    })
                }
                catch(error){
                    console.log('Could not respond to dew_select_colour interaction for invalid colour')
                }
            }

            //Prepare dew select menu
            let dewOptions = [[], [], [], [], []]
            for(j in dewArray){
                if(Number(j) < 6){
                    for(k in dewArray[j]){
                        if(dewOptions[Number(j) - 1].length < 26){
                            if(dewArray[j][k].name && dewArray[j][k].role){
                                dewOptions[Number(j) - 1].push({
                                    "label": truncateString(dewArray[j][k].name, 22),
                                    "description": dewArray[j][k].description ? truncateString(dewArray[j][k].description, 47) : '',
                                    "value": dewArray[j][k].role
                                })
                            }
                        }
                    }
                }
            }

            //Prepare prompt menus
            let selects = []
            for(j in dewOptions){
                if(dewOptions[j].length){
                    selects.push(
                        new Discord.MessageActionRow()
                        .addComponents(
                            new Discord.MessageSelectMenu()
                            .setCustomId('dew_select_flavour')
                            .setPlaceholder('Select a Dew flavour')
                            .addOptions(dewOptions[j]),
                        )
                    )
                }
            }

            //Send flavour prompt(s)
            try{
                const flavourEmbed = new Discord.MessageEmbed()
                .setColor('GREEN')
                .setTitle('Select a Dew')
                .setDescription('Which Mountain Dew flavour do you want?')
                .setTimestamp()
                i.update({
                    embeds: [flavourEmbed],
                    ephemeral: true,
                    components: selects
                })
            }
            catch(error){
                console.log('Could not respond to dew_select_colour interaction')
            }
        }
        else{
            return
        }
    }

    //Check for dew_select_flavour button
    if(i.customId === 'dew_select_flavour'){
        //if(!i.guild) return
        if(i.values || i.values[0]){
            let rolePrefix = '·'
            let errors = []

            //Give dew role
            try{
                let role = i.guild.roles.cache.find(r => r.name === `${rolePrefix} ${i.values[0]} ${rolePrefix}`)
                if(role){
                    //Remove previous role(s)
                    try{
                        i.member.roles.cache
                        .filter(r => r.name.startsWith(rolePrefix))
                        .forEach(r => i.member.roles.remove(r).catch(e => errors.push('Could not remove previous MTN Dew roles.')))
                    }
                    catch(e){
                        errors.push('Could not remove previous MTN Dew roles.')
                    }

                    //Give new dew role
                    await i.member.roles.add(role)
                }
                else{
                    errors.push(`Could not find **${truncateString(i.values[0], 50)}** role.`)
                }
            }
            catch(e){
                errors.push('Could not give specified MTN Dew role.')
            }

            //Send flavour prompt(s)
            try{
                const embed = new Discord.MessageEmbed()
                .setColor('GREEN')
                .setTitle('Role Given')
                .setDescription(errors.length ? `There was an error.\nYou may or may not have recieved the **${truncateString(i.values[0], 50)}** role.` : `You have recieved the **${i.values[0]}** role.`)
                .setTimestamp()
                if(errors.length) embed.addField('Errors', errors.join('\n'))
                i.update({
                    embeds: [embed],
                    ephemeral: true,
                    components: []
                })
            }
            catch(error){
                console.log('Could not respond to dew_select_flavour interaction')
            }
        }
        else{
            return
        }
    }
};