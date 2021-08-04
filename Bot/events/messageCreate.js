module.exports = async (client, message) => {
    //MessageEmbeds
    const Discord = require("discord.js");

    //Ignore all bots
    if (message.author.bot) return;

    //Ignore DM channels
    if (message.channel.dm) return;

    //Define prefix
    let prefix = client.config.prefix

    //Ignore messages without prefixes
    const cmdPrefix = message.content.startsWith(prefix);
    if (!cmdPrefix) return;

    //Our standard argument/command name definition.
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    //Grab the command data from the client.commands map
    const cmd = client.commands.get(command) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(command));

    //If that command doesn't exist, silently exit and do nothing
    if (!cmd) return;

    //Check for message author permission
    if(!client.config.admins.includes(message.author.id)) return message.reply('You don\'t have permission to do that')

    //Permission Checking
    if(!message.guild.me.permissionsIn(message.channel).has("SEND_MESSAGES")) return
    if(!message.guild.me.permissionsIn(message.channel).has("EMBED_LINKS")) return message.reply(`I don't have permission to embed links.\nPlease ask an admin to configure my permissions.`)

    //Error Messages
    function sendError(input) {
        const errortick = '`'
        let parts = input.split('||', 2);
        const error = new Discord.MessageEmbed()
        .setColor('RED')
        .setTitle('Error')
        .setDescription(parts[0])
        .addField('Usage', `${errortick}${prefix}${parts[1]}${errortick}`)
        .setFooter(client.user.username, client.user.avatarURL({ dynamic: true }));
        message.react('❌').catch(error => { console.log(`There was an error reacting to the message.`) })
        message.reply({embeds: [error]})
    }

    //Run the command
    try{
        await cmd.run(client, message, args, sendError);
    }
    catch(error){
        //Truncate string
        function truncateString(str, num) {
            if (str.length <= num) {
                return str
            }
            return str.slice(0, num) + '...'
        }

        //Send embed
        const embed = new Discord.MessageEmbed()
        .setColor('RED')
        .setTitle('Execution Error')
        .setDescription('There was an error running the command.')
        .addField('Error', truncateString(error.toString(), 1021))
        .setTimestamp()
        message.channel.send({embeds: [embed]})
    }
};