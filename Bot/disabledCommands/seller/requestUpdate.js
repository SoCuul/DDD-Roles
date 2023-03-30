//Modules
import { Modal, TextInputComponent, MessageActionRow } from 'discord.js'

export const info = {
    name: 'requestupdate',
    description: 'Request an update to your Dew Market seller page.',
}

export const execute = async (client, i) => {
    //Check for seller perms
    if (!i?.member?.roles?.cache.get('882989568465453120')) return

    //Create modal
    const modal = new Modal()
        .setCustomId('requestSPUpdate')
        .setTitle('Request Seller Page Update')

    const updateInfo = new TextInputComponent()
        .setCustomId('updateInfo')
        .setLabel('What would you like to be changed?')
        .setStyle('PARAGRAPH')

    const firstActionRow = new MessageActionRow().addComponents(updateInfo)
    modal.addComponents(firstActionRow)

    //Show the modal to the user
	await i.showModal(modal)

    return
}