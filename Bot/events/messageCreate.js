const { MessageEmbed } = require('discord.js');
function truncateString(str, num) {
    if (str.length <= num) {
        return str
    }
    return str.slice(0, num) + '...'
}

module.exports = async (client, message) => {
    //Check for valid command instance
    if (!message.guild || message.author.bot) return
    
    //Random messages
    if (message.mentions.users.has(client.user.id)) message.channel.send(
        client.random(client.msgs.randomMessages)
    )

    //Define prefix
    let prefix = client.config.prefix

    //Ignore messages without prefixes
    if (!message.content.startsWith(prefix)) return;

    //Get command name/args
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    //Error Messages
    function sendError (input, cmd) {
        if(!input || !cmd) return

        return new MessageEmbed()
        .setColor('RED')
        .setTitle('Error')
        .setDescription(input)
        .addField('Usage', `\`${prefix}${cmd}\``)
        .setFooter(client.user.username, client.user.displayAvatarURL({ dynamic: true }))
    }

    //Grab the command data from the client.commands map
    const cmd = client.commands.get(command)
  
    //If that command doesn't exist, return
    if (!cmd) return

    //Check for message author permission
    if(!client.config.admins.includes(message.author.id)) return message.reply('You don\'t have permission to do that')

    //Permission Checking
    if(!message.guild.me.permissionsIn(message.channel).has("SEND_MESSAGES")) return
    if(!message.guild.me.permissionsIn(message.channel).has("EMBED_LINKS")) return message.reply(`I don't have permission to embed links.\nPlease ask an admin to configure my permissions.`)

    //Run the command
    try {
        await cmd.run(client, message, args, sendError)
    }
    catch (error) {
        //Send embed
        const embed = new MessageEmbed()
        .setColor('RED')
        .setTitle('Execution Error')
        .setDescription('There was an error running the command.')
        .addField('Error', truncateString(error.toString(), 1021))
        .setTimestamp()
        message.reply({
            embeds: [embed]
        })
    }
};