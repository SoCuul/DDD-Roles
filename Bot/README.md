# SlashHandler

## About
SlashHandler is a discord.js slash command handler. It it extremely modular and very easy to modify to your needs.
It also has the benefit of being colour coded, to help you identify all your logs.

## Setup
Copy the files `config.js` and `.env` from the folder `/sample-files` into the main directory.
Configure these files to your liking.

Then, copy the `cmd.js` file to the commands directory. This is where you can start creating commands.
The **info** section is used by discord to register your slash command and the **execute** section is where your logic will be placed.

## Running
To deploy the slash commands to Discord's servers, run the `deploy.js` script. You can optionally add a `Guild ID` as a command-line parameter, if you would like to register guild commands.

Finally, you can run the index.js to start the main bot process!

## Support
If you need help using this framework, you can join my [discord server](https://discord.com/invite/cGW5vdNV3t).

Note: Support will not be provided for general-purpose JavaScript/Discord.JS questions.