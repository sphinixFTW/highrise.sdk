# **highrise-js-sdk**
<p align="center">
  <img src="https://i.ibb.co/d0vtV49/highrise-logo.png" alt="highrise-logo" />
</p>

> **The Highrise JS SDK is a JavaScript library for writing and running Highrise bots.**


## **⚙️ Installation** 
```
npm i highrise.sdk@latest
```

## **✨ Features**

- Easy to use.
- Beginner friendly.
- Auto reconnect system.
- Supports Node version 10+

## **📥 Class Import**
```js
const { Highrise } = require("highrise-js-sdk")

const settings = {
  token: 'EXAMPLE-TOKEN',
  room: 'EXAMPLE-ROOM',
  events: ['ready', 'playerJoin', 'playerLeave', 'messages'],
  reconnect: 5
}

const client = new Highrise({ events: settings.events }, settings.reconnect);
client.login(settings.token, settings.room);
```
## **📘 Documentation**

[Highrise JS SDK Documentation](https://highrise-js.notion.site/Highrise-JS-Documentation-2433f19c38c640d7ae361eefd720fc57)

## **Event Handling in highrise-js-sdk**
By default, the 'ready' event is included, ensuring that you receive notifications when the bot is ready and connected to the Highrise server. However, for other events, you need to explicitly include them during the class import.

To include additional events, follow these steps:

1. Import the Highrise class from the highrise-js-sdk package.
2. Specify the events you want to receive by passing them as an array to the events parameter during the class import.
3. Ensure that you import the necessary event handlers or listeners to handle the specific events of interest.

For example:
```js
const { Highrise } = require("highrise-js-sdk");

// Specify the events you want to receive
const eventsOfInterest = ['ready', 'playerJoin', 'playerLeave', 'messages', 'emoteCreate'];

// Create an instance of the Highrise class with the specified events
const bot = new Highrise({ events: eventsOfInterest });

// Continue with the rest of your code and configurations
```
By including the desired events during the class import, you ensure that the corresponding event handlers are set up and triggered when those specific events occur within the Highrise environment.
To learn more about the available events and their descriptions, you can refer to the [Highrise-js SDK Documentation](https://highrise-js.notion.site/Get-Methods-3be2c38eb9cc4866b9dbff4575bf011e).
With the updated event handling mechanism, you have greater control over the types of events you receive, allowing you to tailor the behavior and functionality of your bot according to your specific requirements.

## **🎐 Events**


## Note

This package is not an official Highrise package, it's self-made by iHsein (sphinix) and is still in beta.

