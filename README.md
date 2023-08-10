# **highrise.sdk**
<p align="center">
  <img src="https://i.ibb.co/d0vtV49/highrise-logo.png" alt="highrise-logo" />
</p>

> **The Highrise SDK is a JavaScript library for writing and running Highrise bots.**


## **⚙️ Installation** 
```
npm i highrise.sdk@latest
```

## **✨ Features**

- Easy to use.
- Beginner friendly.
- Auto reconnect system.
- Supports Node version 10+
- Supports Highrise WebAPI

## **📥 Class Import**
1. Import the necessary classes and modules from the SDK:
```js
const { Highrise, GatewayIntentBits, WebApi } = require('highrise.sdk');
```

2. Set up the bot's settings by providing a bot token and room ID:
```js
const settings = {
  token: 'CHANGE-ME', // Replace with your bot token
  room: 'CHANGE-ME', // Replace with the room ID your bot will join
  reconnect: 5 // Reconnect duration in seconds
};
```

3. Create an instance of the Highrise bot, specifying the desired intents and cache option:
```js
const bot = new Highrise({
  intents: [
    GatewayIntentBits.Ready,
    GatewayIntentBits.Messages,
    GatewayIntentBits.Joins,
    GatewayIntentBits.Leaves,
    GatewayIntentBits.Error
  ],
  cache: true
}, settings.reconnect);
```

3. Logging in the bot:
```js
bot.login(settings.token, settings.room);
```

## **🎋 GatewayIntentBits**
GatewayIntentBits represents the different intents or event types that your bot can listen for. By specifying these intents when creating the bot, you can control which events your bot will receive. The available intents include:

- `GatewayIntentBits.Ready`: Indicates when the bot is ready to start interacting.
- `GatewayIntentBits.Messages`: Represents chat messages sent in the Highrise room.
- `GatewayIntentBits.DirectMessages`: Represents direct messages sent to the bot.
- `GatewayIntentBits.Joins`: Indicates when users join the room.
- `GatewayIntentBits.Leaves`: Indicates when users leave the room.
- `GatewayIntentBits.Reactions`: Represents reactions added to players.
- `GatewayIntentBits.Emotes`: Represents emotes added to players.
- `GatewayIntentBits.Tips`: Represents tip reactions received.
- `GatewayIntentBits.VoiceChat`: Represents voice chat events.
- `GatewayIntentBits.Movements`: Indicates when users move within the room.
- `GatewayIntentBits.Error`: Represents errors that occur during API operations.
- `GatewayIntentBits.Moderate`: Indicates when moderators perform moderation actions on players.

You can choose the intents based on the events you want your bot to handle.

## **📦 Cache Option**
The cache option, when set to true, enables caching of certain data to optimize performance and reduce API calls. By enabling the cache and using the appropriate intents, you can utilize methods that rely on cached data rather than making API requests.

## **📖 Examples**
- Listening for the ready event:
```js
bot.on('ready', (session) => {
  // Handle bot ready event
});
```
- Listening for chat messages:
```js
bot.on('chatCreate', async (user, message) => {
  // Handle chat message event
});
```
- Listening for errors:
```js
bot.on('error', (message) => {
  // Handle error event
});
```

## **📘 Documentation**
Refer to the SDK documentation for more information on available events and methods.
[Highrise JS SDK Documentation](https://bit.ly/highrise-sdk)

## **🤝 Contributions**
Contributions to the Highrise SDK are welcome! If you find any issues or want to add new features, feel free to submit a pull request.

## Note

This package is not an official Highrise package, it's self-made by iHsein (sphinix) and is still in beta.

