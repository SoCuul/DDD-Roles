//Modules
import axios from 'axios'
import { createRequire } from "module"
import * as log from './log.js'

const require = createRequire(import.meta.url)

export const external = async (client) => {
    console.log(log.external('Loading configuration files from GitHub...'))

    try {
        //Send requests
        const responses = await Promise.all([
            await axios.get('https://raw.githubusercontent.com/SoCuul/DDD-Roles/main/msgs.json'),
            await axios.get('https://raw.githubusercontent.com/SoCuul/DDD-Roles/main/flavours.json'),
            await axios.get('https://raw.githubusercontent.com/SoCuul/DDD-Roles/main/sar.json')
        ])

        //Retrieve response data
        const [ msgs, flavours, sar] = responses

        //Check for missing data
        if (!msgs?.data || !flavours?.data || !sar?.data) {
            console.log(log.error('Invalid data was retrieved from GitHub. Bot functionality may be reduced.'))
            return false
        }

        //Attach to client
        client.msgs = msgs.data
        client.flavours = flavours.data
        client.sar = sar.data

        //Notify user
        console.log(log.external('Configuration data retrieved!'))

        return true
    }
    catch (error) {
        console.log(log.error('There was an error retrieving configuration files. Bot functionality may be reduced.'))
        console.log(error)

        return false
    }
}

export const local = async (client) => {
    console.log(log.external('Loading configuration files from local store...'))

    try {
        //Parse local files
        client.msgs = await require('../../msgs.json')
        client.flavours = await require('../../flavours.json')
        client.sar = await require('../../sar.json')

        //Notify user
        console.log(log.external('Configuration data retrieved!'))
    }
    catch (error) {
        console.log(log.error('There was an error retrieving configuration files. Bot functionality may be reduced.'))
        console.log(error)
    }
}