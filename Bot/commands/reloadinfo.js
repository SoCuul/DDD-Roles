const Discord = require("discord.js")
const axios = require('axios')

module.exports = {
    aliases: [],
    async run (client, message, args, sendError) {
        if (!args[0]) return message.reply({
            embeds: [
                sendError('Please enter a value to reload.', 'reloadinfo <flavours/sar/msgs>')
            ]
        })

        switch (args[0]) {
            case 'flavours': {
                try {
                    let response = await axios.get('https://raw.githubusercontent.com/SoCuul/DDD-Roles/main/flavours.json')
        
                    if (response && response.data) {
                        //Set flavours
                        client.flavours = response.data
        
                        //Respond
                        message.reply('✅ Dew flavours have been reloaded successfully')
                    }
                    else {
                        message.reply('❌ Could not reload dew flavours. Try again in a little bit.')
                    }
                }
                catch (error) {
                    console.log(error)
                    message.reply('❌ Could not reload dew flavours. Try again in a little bit.')
                }
                
                break
            }
            case 'sar': {
                try {
                    let response = await axios.get('https://raw.githubusercontent.com/SoCuul/DDD-Roles/main/sar.json')
        
                    if (response && response.data) {
                        //Set flavours
                        client.sar = response.data
        
                        //Respond
                        message.reply('✅ Self assign roles have been reloaded successfully')
                    }
                    else {
                        message.reply('❌ Could not reload self assign roles. Try again in a little bit.')
                    }
                }
                catch (error) {
                    console.log(error)
                    message.reply('❌ Could not reload self assign roles. Try again in a little bit.')
                }
                
                break
            }
            case 'msgs': {
                try {
                    let response = await axios.get('https://raw.githubusercontent.com/SoCuul/DDD-Roles/main/msgs.json')
        
                    if (response && response.data) {
                        //Set flavours
                        client.msgs = response.data
        
                        //Respond
                        message.reply('✅ Bot messages have been reloaded successfully')
                    }
                    else {
                        message.reply('❌ Could not reload bot messages. Try again in a little bit.')
                    }
                }
                catch (error) {
                    console.log(error)
                    message.reply('❌ Could not reload bot messages. Try again in a little bit.')
                }
                
                break
            }
            default: {
                return message.reply({
                    embeds: [
                        sendError('Please enter a value to reload.', 'reloadinfo <flavours/sar/msgs>')
                    ]
                })
            }
        }
    }
};
