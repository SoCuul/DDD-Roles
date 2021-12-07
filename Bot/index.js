const fs = require('fs')
const path = require('path')
const axios = require('axios')

const Discord = require('discord.js')
const client = new Discord.Client({
	intents: [
        'GUILDS',  
	    'GUILD_MESSAGES'
	],
    allowedMentions: { repliedUser: false }
})

//Attach to client
client.config = require('./config.json')
client.wait = ms => new Promise(resolve => setTimeout(resolve, ms));
client.random = arr => arr[Math.floor(Math.random() * arr.length)]
client.sendError = function (input) {
    if(!input) return
    
    return new Discord.MessageEmbed()
    .setColor('RED')
    .setTitle('Error')
    .setDescription(input)
    .setFooter(client.user.username, client.user.displayAvatarURL({ dynamic: true }))
}

//Load env
require('dotenv').config()

//Load events
fs.readdir('./events/', (_err, files) => {
    files.forEach(file => {
        if (!file.endsWith('.js')) return;
        
        const event = require(`./events/${file}`);
        let eventName = file.split('.')[0];

        client.on(eventName, event.bind(null, client));
        console.log(`Event loaded: ${eventName}`);
    });
});

client.commands = new Discord.Collection();

//Load commands
fs.readdir('./commands/', async (_err, files) => {
    files.forEach(file => {
        if (!file.endsWith('.js')) return;

        let props = require(`./commands/${file}`);
        let commandName = file.split('.')[0];

        client.commands.set(commandName, props);
        console.log(`Command loaded: ${commandName}`);
    });
});

//Bot Informaation Files
if (client.config.localMode) {
    client.flavours = require(path.join(process.cwd(), '/../flavours.json'))
    client.sar = require(path.join(process.cwd(), '/../sar.json'))
    client.msgs = require(path.join(process.cwd(), '/../msgs.json'))
}
else {
    //Download flavour list
    axios.get('https://raw.githubusercontent.com/SoCuul/DDD-Roles/main/flavours.json')
    .then(response => {
        if (response && response.data) {
            client.flavours = response.data
        }
        else {
            console.log('[Error] Could not download flavour list. Try again in a little bit.')
            process.exit(1)
        }
    })
    .catch(() => {
        console.log('[Error] Could not download flavour list. Try again in a little bit.')
        process.exit(1)
    })

    //Download self assign roles list
    axios.get('https://raw.githubusercontent.com/SoCuul/DDD-Roles/main/sar.json')
    .then(response => {
        if (response && response.data) {
            client.sar = response.data
        }
        else {
            console.log('[Error] Could not download self assign roles list. Try again in a little bit.')
            process.exit(1)
        }
    })
    .catch(() => {
        console.log('[Error] Could not download self assign roles list. Try again in a little bit.')
        process.exit(1)
    })

    //Download bot messages list
    axios.get('https://raw.githubusercontent.com/SoCuul/DDD-Roles/main/msgs.json')
    .then(response => {
        if (response && response.data) {
            client.msgs = response.data
        }
        else {
            console.log('[Error] Could not download bot messages list. Try again in a little bit.')
            process.exit(1)
        }
    })
    .catch(() => {
        console.log('[Error] Could not download bot messages list. Try again in a little bit.')
        process.exit(1)
    })
}

//Client Login
try {
    client.login(process.env.TOKEN)
}
catch (error) {
    console.log('[Error] Could not login. Please make sure the token is valid.')
    process.exit(1)
}