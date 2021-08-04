const fs = require('fs');

const Discord = require('discord.js');
const client = new Discord.Client({
	intents: [
        'GUILDS', 
	    'GUILD_MESSAGES'
	],
    allowedMentions: { repliedUser: false }
});

//Load config
const config = require('./config.json');
const { default: axios } = require('axios');
client.config = config;

//Load env
require('dotenv').config()

/* Load all events */
fs.readdir('./events/', (_err, files) => {
	files.forEach(file => {
		if (!file.endsWith('.js')) return;
		const event = require(`./events/${file}`);
		let eventName = file.split('.')[0];
		console.log(`Event loaded: ${eventName}`);
		client.on(eventName, event.bind(null, client));
	});
});

client.commands = new Discord.Collection();

/* Load commands */
fs.readdir('./commands/', (_err, files) => {
	files.forEach(file => {
		if (!file.endsWith('.js')) return;
		let props = require(`./commands/${file}`);
		let commandName = file.split('.')[0];
		client.commands.set(commandName, props);
		console.log(`Command loaded: ${commandName}`);
	});
});

//Client Login
try{
    client.login(process.env.TOKEN)
}
catch(error){
    console.log('[Error] Could not login. Please make sure the token is valid.')
    process.exit(1)
}

//Download flavour list
try{
    axios.get('https://raw.githubusercontent.com/SoCuul/DDD-Roles/main/flavours.json')
    .then(response => {
        if(response && response.data){
            client.flavours = response.data
        }
        else{
            console.log('[Error] Could not download flavour list. Try again in a little bit.')
        }
    })
}
catch(error){
    console.log('[Error] Could not download flavour list. Try again in a little bit.')
}

//client.flavours = 