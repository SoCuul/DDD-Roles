module.exports = {
    aliases: ['dewreload', 'rd'],
    async run(client, message, args, sendError) {
        const Discord = require("discord.js");
        const axios = require('axios');

        try{
            let response = await axios.get('https://raw.githubusercontent.com/SoCuul/DDD-Roles/main/flavours.json')
            if(response && response.data){
                //Set flavours
                client.flavours = response.data

                //Respond
                message.reply('✅ Dew flavours have been reloaded successfully')
            }
            else{
                message.reply('❌ Could not reload dew flavours. Try again in a little bit.')
            }
        }
        catch(error){
            console.log(error)
            message.reply('❌ Could not reload dew flavours. Try again in a little bit.')
        }
    }
};