//Modules
import { Intents } from 'discord.js'

//The presences the bot will use
export const presences = (client) => ({
    "activities": [
        {
            "name": "Activity 1",
            "type": "PLAYING"
        },
        {
            "name": "Activity 2",
            "type": "WATCHING"
        }
    ],
    "switchActivityInterval": 3600000,

    "status": "online"
})

//Users that can run internal commands
export const owners = ["ownerID"]

//The intents the bot will use to connect to the gateway
export const intents = [
    Intents.FLAGS.GUILDS
]