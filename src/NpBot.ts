import { ChatUserstate, Client as TmiClient } from "tmi.js";
import * as readline from "readline";
import GOsuMemoryHook from "./GOsuMemoryHook";
import INpBotConfiguration from "./INpBotConfiguration";

export default class NpBot
{
	private client: TmiClient;
	private gOsuMemoryHook: GOsuMemoryHook;
	private npBotConfiguration: INpBotConfiguration;

	constructor(npBotConfiguration: INpBotConfiguration)
	{
		console.log(`[${new Date().toLocaleTimeString()}] Initializing Twitch chat bot...`);
		this.client = new TmiClient({
			identity: {
				username: npBotConfiguration.botUsername,
				password: npBotConfiguration.botPassword
			}
		});
		this.gOsuMemoryHook = new GOsuMemoryHook(npBotConfiguration.gOsuMemoryPort);

		this.npBotConfiguration = npBotConfiguration;

		this.client.on("join", (channel, username, self) =>
		{
			if(self) console.log(`[${new Date().toLocaleTimeString()}] Successfully joined twitch chat channel ${channel} as ${username}.`);
		});
		this.client.on("message", (channel, userstate, message, self) => this.handleMessage(channel, userstate, message, self));
		this.client.on("notice", (channel, msgid, message) => {console.log(message)});

		this.client.connect().catch((error: string) => this.handleConnectionError(error)).then(() => {
			this.client.join(npBotConfiguration.twitchChannelName).catch((error: string) => this.handleConnectionError(error));
		});
	}

	handleMessage(channel: string, userstate: ChatUserstate, message: string, self: boolean)
	{
		if(self) return;

		if(message.toLowerCase() === this.npBotConfiguration.npCommand.toLowerCase())
		{
			if(this.gOsuMemoryHook.npBeatmapId == -31)
			{
				if(this.npBotConfiguration.npGOsuMemoryNotReadyMessage != null)
					this.client.say(channel, this.npBotConfiguration.npGOsuMemoryNotReadyMessage.replace("{{username}}", userstate.username));
			}
			else
			{
				const npMessage = this.npBotConfiguration.npMessage
					.replace("{{username}}", userstate.username)
					.replace("{{beatmapLink}}", `https://osu.ppy.sh/b/${this.gOsuMemoryHook.npBeatmapId}`);
				if(this.npBotConfiguration.useActionInsteadOfMessage)
					this.client.action(channel, npMessage);
				else
					this.client.say(channel, npMessage);	
			}
		}
	}

	handleConnectionError(error: string)
	{
		// If GOsuMemoryHook is marked as dieded this should also die
		if(this.gOsuMemoryHook.die) return;
		if(error.indexOf("Login authentication failed") > -1)
		{
			console.error(`[${new Date().toLocaleTimeString()}] Failed to log in, please make sure your botUsername and botPassword in config.json are correct.`);
			const readLineInterface = readline.createInterface(process.stdin, process.stdout);
			this.gOsuMemoryHook.die = true;
			readLineInterface.question("", () => {
				process.exit(0);
			});
		}
		else if(error.indexOf("No response from Twitch.") > -1)
		{
			console.error(`[${new Date().toLocaleTimeString()}] Failed to join channel, please make sure your twitchChannelName in config.json is correct.`);
			const readLineInterface = readline.createInterface(process.stdin, process.stdout);
			this.gOsuMemoryHook.die = true;
			readLineInterface.question("", () => {
				process.exit(0);
			});
		}
		else
		{
			console.error(`[${new Date().toLocaleTimeString()}] ERROR: Unrecognized error has occured.`);
			console.error(error);
		}
	}
}
