// TODO: Make process.exits(0) just pause the app indefinitely or something because now it just exits the application without giving them a chance to read anything
import { existsSync, readFileSync, writeFileSync } from "fs";
import * as readline from "readline";
import INpBotConfiguration from "./INpBotConfiguration";
import NpBot from "./NpBot";

// Load configuration
let npBotConfiguration: INpBotConfiguration;
if(existsSync(`./config.json`))
{
	npBotConfiguration = JSON.parse(readFileSync(`./config.json`).toString());
}
else
{
	npBotConfiguration = {
		botUsername: "",
		botPassword: "",
		twitchChannelName: "",
		gOsuMemoryPort: 24050,
		npCommand: "!np",
		useActionInsteadOfMessage: true,
		npMessage: "@{{username}}, here u go: {{beatmapLink}}",
		npGOsuMemoryNotReadyMessage: "gosumemory died Sadge, please restart me"
	}
	writeFileSync(`./config.json`, JSON.stringify(npBotConfiguration, null, "\t"));
}

// Check if every required value is defined
const requiredValues = ["botUsername", "botPassword", "twitchChannelName", "npCommand", "npMessage"]
let exitAfter = false;
for(const requiredValue in requiredValues)
{
	if(npBotConfiguration[requiredValues[requiredValue]] == undefined || npBotConfiguration[requiredValues[requiredValue]] == "")
	{
		console.error(`You have to set a value for ${requiredValues[requiredValue]} in config.json`);
		exitAfter = true;
	}
}
if(exitAfter)
{
	const readLineInterface = readline.createInterface(process.stdin, process.stdout);
	readLineInterface.question("", () => {
		process.exit(0);
	});
}
else
{
	// Define defaults if optional values are undefined
	if(npBotConfiguration.gOsuMemoryPort == undefined) npBotConfiguration.gOsuMemoryPort = 24050;
	if(npBotConfiguration.npGOsuMemoryNotReadyMessage == undefined) npBotConfiguration.npGOsuMemoryNotReadyMessage = null;
	if(npBotConfiguration.useActionInsteadOfMessage == undefined) npBotConfiguration.useActionInsteadOfMessage = true;
	
	// Run the bot
	const npBot = new NpBot(npBotConfiguration);
}
