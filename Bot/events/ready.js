module.exports = (client) => {
    const Discord = require('discord.js')

    console.log(`DDD Roles is online.`)
    console.log(`${client.guilds.cache.reduce((a, c) => a + c.memberCount, 0)} users`)

    //Set first status
    try{
        client.user.setPresence({
            activities: [
                {
                    name: client.config.activityStatus,
                    type: client.config.activityType
                }
            ]
        })
    }
    catch(error){
        console.log('[Status Error] Could not set status')
    }

    //Set status each hour
    setInterval(() => {
        try{
            client.user.setPresence({
                activities: [
                    {
                        name: client.config.activityStatus,
                        type: client.config.activityType
                    }
                ]
            })
        }
        catch(error){
            console.log('[Status Error] Could not set status')
        }
    }, 3600000);
};