export default interface INpBotConfiguration
{
	botUsername: string,
	botPassword: string,
	twitchChannelName: string,
	gOsuMemoryPort?: number
	npCommand: string
	useActionInsteadOfMessage: boolean
	npMessage: string
	npGOsuMemoryNotReadyMessage?: string
}
