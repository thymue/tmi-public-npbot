# How to use this npbot
- Launch the application once by double clicking on the downloaded file which can be downloaded [here](https://github.com/Thymue/tmi-public-npbot/releases)
- Edit `config.json` in the application's directory
> Fill the missing values or change anything however you want just don't break it
```
{
	"botUsername": "your_bot_account_name",
	- Twitch bot's username
  
	"botPassword": "oauth:fdsf15dfsdfsd156fdsf156sdf",
	- >>> OAUTH PASSWORD <<< FOR YOUR BOT ACCOUNT, GENERATE IT HERE: https://twitchapps.com/tmi/
  
	"twitchChannelName": "your_twitch_channel_name",
	- Twitch channel in which the bot will be replying to !np
  
	"gOsuMemoryPort": 24050,
	- gosumemory port, if you didn't change it in gosumemory, you can leave it alone
  
	"npCommand": "!np",
	- command that users will have to type in chat to get response
  
	"useActionInsteadOfMessage": true,
	- uses "/me" instead of just typing in chat. prevents triggering Mikuia afaik
  
	"npMessage": "@{{username}}, here u go: {{beatmapLink}}",
	- message that will be sent after user types !np or whatever you put in npCommand
	- replaces the first occurence of {{username}} with requesting user's name
	- replaces the first occurence of {{beatmapLink}} with current beatmap's link

	"npGOsuMemoryNotReadyMessage": "gosumemory died Sadge, please restart me"
	- message that will be sent in the chat if the bot is ready but gosumemory is not
	- replaces the first occurence of {{username}} with requesting user's name
	- replace "gosumemory died Sadge, please restart me" to null(without "", just null) to send nothing
}
```
- Restart the application, start gosumemory and start osu!

You should be done, test it out in your twitch chat and if it doesn't work try to read the application's window
