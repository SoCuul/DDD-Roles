module.exports = {
    aliases: ['r'],
    async run(client, message, args, sendError) {
        const Discord = require("discord.js");

        if (message.author.id === client.config.ownerID){
            if (!args.length) return sendError('Please provide a command to reload.||reload command')
            const commandName = args[0].toLowerCase();
            const command = message.client.commands.get(commandName)

            if (!command) return sendError('Please provide a valid command to reload.||reload command')

            try {
                delete require.cache[require.resolve(`./${commandName}.js`)];
                const newCommand = require(`./${commandName}.js`);
                client.commands.set(commandName, newCommand);
                message.channel.send(`✅ \`${commandName}\` reloaded successfully`);
            }
            catch (error) {
                message.channel.send(`❌ There was an error reloading \`${commandName}\``);
            }
        }
    }
};