//Modules
import * as log from './log.js'

export const getCommandsInfo = async (commandsInfo) => {
    const commands = []

    for (const cmdPath of commandsInfo) {
        const fileName = cmdPath?.split('/')?.slice(-1)[0] 
    
        //Verify file type
        if (!fileName.endsWith('.js')) break
    
        try {
            //Get command info
            const cmdInfo = await import(`file:///${process.cwd()}/${cmdPath}`)
    
            //Check for required data
            if (!cmdInfo?.info || !cmdInfo?.info.name || !cmdInfo?.info.description || !cmdInfo?.execute) {
                console.log(log.error(`Invalid command: ${fileName}`))
                break
            }
    
            //Load command info into map
            commands.push(cmdInfo.info)
        }
        catch (error) {
            console.log(log.error(`Could not get command info: ${fileName}`))
            console.log(error)
            break
        }
    }

    return commands
}

export const loadCommands = async (map, commandsInfo, logActions) => {
    for (const cmdPath of commandsInfo) {
        const fileName = cmdPath?.split('/')?.slice(-1)[0] 
    
        try {
            //Get command info
            const cmdInfo = await import(`file:///${process.cwd()}/${cmdPath}`)
    
            //Check for required data
            if (!cmdInfo?.info || !cmdInfo?.info.name || !cmdInfo?.execute) {
                console.log(log.error(`Invalid command: ${fileName}`))
                break
            }
    
            //Load command info into map
            map.set(cmdInfo.info.name, cmdInfo)

            if (logActions) console.log(log.file(`Loaded command: ${cmdInfo.info.name}`)) 
        }
        catch (error) {
            console.log(log.error(`Could not load command: ${fileName}`))
            console.log(error)
            break
        }
    }
}

export const loadEvents = async (eventsInfo, client, logActions) => {
    for (const eventPath of eventsInfo) {
        const fileName = eventPath?.split('/')?.slice(-1)[0] 
    
        //Verify file type
        if (!eventPath.endsWith('.js')) break
    
        try {
            //Get event info
            const eventInfo = await import(`file:///${process.cwd()}/${eventPath}`)
    
            //Check for required data
            if (!eventInfo?.name || !eventInfo?.execute) {
                console.log(log.error(`Invalid event: ${fileName}`))
                break
            }
    
            //Load event onto client
            if (eventInfo.once) client.once(eventInfo.name, (...args) => eventInfo.execute(client, ...args))
            else client.on(eventInfo.name, (...args) => eventInfo.execute(client, ...args))

            if (logActions) console.log(log.file(`Loaded event: ${eventInfo.name}`)) 
        }
        catch (error) {
            console.log(log.error(`Could not load event: ${fileName}`))
            console.log(error)
            break
        }
    }
}