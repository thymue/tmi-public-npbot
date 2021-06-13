import { client as WebSocketClient, connection as WebSocketConnection, IMessage as IWebSocketMessage } from "websocket";

export default class GOsuMemoryHook
{
	public npBeatmapId: number = -31;
	public die: boolean = false;
	private gOsuWebSocket: WebSocketClient;
	private port: number;

	constructor(port: number)
	{
		console.log(`[${new Date().toLocaleTimeString()}] Initializing gosumemory websocket...`);
		this.gOsuWebSocket = new WebSocketClient();
		this.port = port;

		this.gOsuWebSocket.on("connect", (webSocketConnection: WebSocketConnection) => {
			console.log(`[${new Date().toLocaleTimeString()}] Successfully connected to gosumemory websocket.`);
			webSocketConnection.on("message", (webSocketMessage: IWebSocketMessage) => this.handleWebSocketMessage(webSocketMessage));
			webSocketConnection.on("error", (error: Error) => this.handleWebSocketError(error));
		});
		this.gOsuWebSocket.on("connectFailed", (error: Error) => this.handleWebSocketError(error));

		this.gOsuWebSocket.connect(`ws://127.0.0.1:${port}/ws`);
	}

	handleWebSocketMessage(webSocketMessage: IWebSocketMessage)
	{
		this.npBeatmapId = JSON.parse(webSocketMessage.utf8Data).menu.bm.id;
	}

	handleWebSocketError(e: Error)
	{
		if(this.die) return;
		if(e.message.indexOf("ECONNREFUSED") > -1)
		{
			console.error(`[${new Date().toLocaleTimeString()}] ERROR: Couldn't connect to gosumemory websocket are you sure it's running? Retrying in 5 seconds.`);

			setTimeout(() =>
			{
				this.gOsuWebSocket.connect(`ws://127.0.0.1:${this.port}/ws`);
			}, 5000);
		}
		else if(e.message.indexOf("ECONNRESET") > -1)
		{
			this.npBeatmapId = -31;
			console.error(`[${new Date().toLocaleTimeString()}] ERROR: Seems like gosumemory websocket stopped working, we'll try to reconnect in 5 seconds.`);

			setTimeout(() =>
			{
				this.gOsuWebSocket.connect(`ws://127.0.0.1:${this.port}/ws`);
			}, 5000);
		}
		else
		{
			console.error(`[${new Date().toLocaleTimeString()}] ERROR: Unrecognized error has occured. You can probably just restart the application and it should be working again.`);
			console.error(`${e.name}\n${e.message}\n${e.stack}`);
		}
	}
}
