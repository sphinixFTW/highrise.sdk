# Changelog

## [1.1.7] - 2023-09-29
## Fixed
- Fixed an issue where, upon shutting down the bot, the websocket would sometimes remain open.

## [1.1.6] - 2023-08-10
## Added
- Introducing a new event that emits after performing moderation actions ["kick", "ban", "unban", "mute", "unmute"].
- Implementation of a new Gateway for the "Moderate" event.
- Addition of a new method that enables you to gracefully shut down the bot.

## Fixed
- Addressed issues with WebApi, where it would occasionally return an error when no results were found. It has been enhanced to now return "null" in such cases.

## [1.1.5] - 2023-08-02
## Added
- A new parameter to the "playerJoin" event that returns the player's position.
- playerTip event now work in both chat and inbox for more information [read this](https://createforum.highrise.game/t/python-sdk-version-23-3-1-bot-api-update/152)
- A new method to fetch the bot information (id, position).

## Changed
- Returning the error data is no longer available. The package should not log the error; instead, it will log "reconnecting."
- You can now retrieve the bot's id and position by using "bot.client.id.get" or "bot.client.position.get." This will be updated automatically when calling any request that includes the bot.

## Fixed
- Caching the player's data will now cache the player's position on join. Instead of 0,0,0, it will cache the actual position.
- Using "bot.move" or "bot.player.teleport" will now save the bot's position.

## [1.1.4] - 2023-07-17
## Added
- Implemented new bot customization methods.
- Expanded the WebApi to retrieve item and grab data.

## Changed
- Reorganized the code structure by merging the WalletRequest file into the BotRequest file to handle all bot requests in one place.

## Fixed
- Resolved issues with the WebApi methods that were causing crashes in the bot.

## [1.1.3] - 2023-07-08
## Fixed
- Applied a hotfix to the WebApi, resolving the issue where some methods were returning ERROR 404.

## [1.1.1] - 2023-07-05
## Fixed
- A hotfix has been applied to the Highrise class, resolving the issue where importing the class resulted in a "TypeError: Highrise is not a constructor" error.


## [1.1.0] - 2023-07-05
## Added
- New tip methods: Now the bot can tip any player using the `player.tip(user_id, amount)` function. This function returns a promise that resolves to either "success" or "insufficient_funds". The available tip amounts are similar to the ones in the game: "1, 5, 10, 50, 100, 500, 1000, 5000, 10000". Please note that similar to player tipping, a fee is applied.

## Fixed
- Fixed dot notation issue for methods.
- Fixed a crash caused by the getNewsFeed function in the WebApi when attempting to fetch a post.

## [1.0.0]

## [1.0.0] - 2023-07-04
## Added
- New WebAPI support.
- Introducing the option to enable or disable cache.
- Expanded the available intents to provide more event handling capabilities.


## Changed
- Consolidated the previous [highrise-js-sdk](https://github.com/sphinixFTW/highrise-js-sdk) package into the current [highrise.sdk](https://github.com/sphinixFTW/highrise.sdk) package. The old package will no longer be supported as we focus on testing and improving the new version.
- Restructured the folder organization for improved readability and accessibility.
- Implemented a new event handling system using the newly introduced intents, allowing for more streamlined event management within the package.
- Modified the behavior of the cache functionality, now providing the ability to enable or disable it as needed.
- Enhanced the reconnect and connect system to improve stability and reliability.
- Standardized event names across the package for consistency. For example, the event `chatMessageCreate` has been renamed to `chatCreate`. Similar changes have been made to other events. Refer to the [documentation](bit.ly/highrise-sdk) for more information.