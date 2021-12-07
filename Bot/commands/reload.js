const Discord = require("discord.js")
const path = require("path")

module.exports = {
    aliases: [],
    async run (client, message, args, sendError) {
        if (message.author.id === client.config.ownerID){
            if (!args[0]) return message.reply({
                embeds: [
                    sendError('Please provide a command to reload.', 'reload <command>')
                ]
            })
            
            const commandName = args[0].toLowerCase();
            const command = message.client.commands.get(commandName)

            if (!command) return message.reply({
                embeds: [
                    sendError('Please provide a command to reload.', 'reload <command>')
                ]
            })

            try {
                let cmdsPath = path.join(path.dirname(require.main.filename) + '/commands/')

                delete require.cache[require.resolve(`${cmdsPath}${commandName}.js`)];

                const newCommand = require(`${cmdsPath}${commandName}.js`);
                client.commands.set(commandName, newCommand);

                message.reply(`✅ \`${commandName}\` reloaded successfully`);
            }
            catch (error) {
                console.log(error)
                message.reply(`❌ There was an error reloading \`${commandName}\``);
            }
        }
    }
};