//Modules
import { Intents } from 'discord.js'

//The presences the bot will use
export const presences = (client) => ({
    "activities": [
        {
            "name": "over roles",
            "type": "WATCHING"
        }
    ],
    "switchActivityInterval": 3600000,

    "status": "online"
})

//Users that can run staff commands
export const staff = ["490559747473539099", "187399608249483265"]

//Users that can run internal commands
export const owners = ["490559747473539099"]

//Where the bot will retrieve it's configuration files
export const localConfig = false

//The intents the bot will use to connect to the gateway
export const intents = [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGES
]