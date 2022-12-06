import Discord from 'discord.js'
import { performance } from 'node:perf_hooks'
import { inspect } from 'node:util'
import { truncateString } from '../../utils/misc.js'
import * as log from '../../utils/log.js'

export const info = {
    name: 'eval',
    description: 'Evaluate JavaScript code (Owner only)',
    options: [
        {
            type: 3,
            name: 'code',
            description: 'The JavaScript code to eval',
            required: true
        }
    ]
}

export const execute = async (client, i) => {
    const code = i.options.getString('code')

    //Check for owner perms
    if (!client.config.owners.includes(i?.user?.id)) return

    //Defer reply
    await i.deferReply()

    //Log action
    console.log(log.info(`Eval executed by ${i?.user?.tag}`))
    
    try {
        const t0 = performance.now()
        let evaled = await eval(`(async () => {\nreturn ${code}\n})();`)
        const t1 = performance.now()

        //Inspect eval
        const type = typeof evaled !== 'undefined' ? typeof evaled : 'N/A'
        if (typeof evaled !== "string") evaled = inspect(evaled)

        const embed = new Discord.MessageEmbed()
        .setColor('GREEN')
        .setTitle('Eval Succeeded')
        .setDescription(`
            \`\`\`js
            ${truncateString(evaled.toString(), 2030)}
            \`\`\`
        `)
        .addFields({ name: '⏲️  Completed in', value: `**${(t1 - t0).toFixed(4)}ms**` })
        .addFields({ name:  '⌨️  Type', value: `\`${type}\`` })
        .setTimestamp()

        //Send response
        await i.editReply({
            embeds: [ embed ]
        })
    }
    catch (error) {
        //Log error
        await console.log('')
        await console.log(log.error('Eval error:'))
        await console.log(error)

        const embed = new Discord.MessageEmbed()
        .setColor('RED')
        .setTitle('Eval Failed')
        .setDescription(`
            \`\`\`js
            ${truncateString(error.toString(), 2030)}
            \`\`\`
        `)
        .setTimestamp()

        //Send response
        await i.editReply({
            embeds: [ embed ]
        })
    }
}