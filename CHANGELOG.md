# Changelog
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