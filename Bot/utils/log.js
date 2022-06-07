//Modules
import chalk from 'chalk'

export const info = (message, prefix) => chalk.cyan(
    `[${prefix ? prefix : 'Info'}] ${message}`
)
export const success = (message, prefix) => chalk.green(
    `[${prefix ? prefix : 'Success'}] ${message}`
)
export const error = (message, prefix) => chalk.red(
    `[${prefix ? prefix : 'Error'}] ${message}`
)
export const file = (message, prefix) => chalk.cyan(
    `[${prefix ? prefix : 'File'}] ${message}`
)
export const external = (message, prefix) => chalk.blue(
    `[${prefix ? prefix : 'External'}] ${message}`
)