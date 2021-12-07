const Discord = require('discord.js')

module.exports = async (client) => {
    console.log(`${client.user.username} is online.`)
    console.log(`${client.guilds.cache.reduce((a, c) => a + c.memberCount, 0)} users`)

    //Set first status
    try {
        client.user.setPresence({
            activities: [
                {
                    name: client.config.activityStatus,
                    type: client.config.activityType
                }
            ]
        })
    }
    catch (error) {
        console.log('[Status Error] Could not set status')
    }

    //Set status each hour
    while (true) {
        await client.wait(3600000)

        //Set status
        try {
            client.user.setPresence({
                activities: [
                    {
                        name: client.config.activityStatus,
                        type: client.config.activityType
                    }
                ]
            })
        }
        catch (error) {
            console.log('[Status Error] Could not set status')
        }
    }
};