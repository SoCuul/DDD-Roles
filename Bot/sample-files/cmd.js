export const info = {
    name: 'test',
    description: 'Test Command'
}

export const execute = async (client, i) => {
    await i.reply('Test!')
}