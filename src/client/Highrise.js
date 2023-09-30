'use strict';
const WebSocket = require('ws');

const handleEvent = require('../handlers/events');
const HighriseClient = require('./BaseClient');

const { EventTypeIntents } = require('../utils/GatewayIntents');
const { generateRid, packageVersion } = require('../utils/Utils');
const { AuthenticationError } = require('../handlers/error');

class Highrise extends HighriseClient {
  /**
   * @class Highrise
   * @extends HighriseClient
   * Represents a Highrise bot client.
   * Manages the WebSocket connection, event handling, and reconnection logic.
   * @param {Object} options - Options for the Highrise bot.
   * @param {number} [reconnectDuration=5] - Duration in seconds for reconnection attempts.
   */
  constructor(options = {}, reconnectDuration = 5) {
    super(options, reconnectDuration);

    // WebSocket connection properties
    this.websocket = WebSocket;
    this.ws = null;
    this.endpoint = 'wss://highrise.game/web/webapi';

    // Bot options
    this.intents = options.intents || [];
    this.cache = options.cache || false;
    this.connected = false;
    this.reconnecting = false;
    this.reconnectTimeoutDuration = reconnectDuration;
    this.apiToken = null;
    this.roomId = null;
    this.keepaliveInterval = null;
    this.messageEventListener = null;
    this.closeEventListener = null;
  }

  /**
   * Log in the bot to the Highrise API.
   * @param {string} api_token - The API token for the bot.
   * @param {string} room_id - The ID of the room for the bot.
   * @returns {void}
   * @throws {Error} If bot token or room ID is missing or invalid.
   */
  login(api_token, room_id) {

    if (!this.reconnecting) {
      // Check if the bot is already connected
      if (this.connected) {
        return console.log('Bot is already connected. Skipping login.'.blue);
      }

      // Validate the API token
      if (!api_token || typeof api_token !== 'string') {
        throw new AuthenticationError("[Aborted] Please supply a valid bot token.");
      }

      // Validate the room ID
      if (!room_id || typeof room_id !== 'string') {
        throw new AuthenticationError("[Aborted] Please supply a valid room ID.");
      }

      // Store the API token and room ID
      this.apiToken = api_token;
      this.roomId = room_id;

      // Create a new WebSocket instance if it doesn't exist or if the connection is closed
      if (!this.ws || this.ws.readyState === WebSocket.CLOSED) {
        this.ws = new WebSocket(this.endpoint, {
          headers: {
            'room-id': room_id,
            'api-token': api_token,
          },
        });

        // Event listener for WebSocket open event
        this.ws.addEventListener('open', () => {
          if (!this.connected) {
            // Bot successfully connected
            const today = new Date().toLocaleString("en-us");
            console.log(`Connected using Highrise Javascript SDK (v${packageVersion()}) at ${today}`.green);
            this.connected = true;
            this.sendKeepalive();
          } else {
            console.log('Reconnected to Highrise API.'.green);
            // Handle reconnection logic, if needed
          }
        });

        // Event listener for WebSocket message event
        this.messageEventListener = (event) => {
          const data = JSON.parse(event.data);
          // Check if the event type is included in the intents
          const eventType = data._type;
          const intents = EventTypeIntents[eventType];
          if (intents && intents.some(intent => this.intents.includes(intent))) {
            this.handleData(data); // Pass the received data to the handler
          }
        };

        this.ws.addEventListener('message', this.messageEventListener);

        // Event listener for WebSocket close event
        this.closeEventListener = (event) => {
          this.close(event);
          this.connected = false;
          this.reconnect();
        };

        this.ws.addEventListener('close', this.closeEventListener);

        // Event listener for WebSocket error event
        this.ws.addEventListener('error', (event) => {
          //console.error('Connection error:', event);
          this.reconnect();
        });
      }
    }
  }

  shutdown() {
    // Remove the close event listener before closing the WebSocket
    if (this.closeEventListener) {
      this.ws.removeEventListener('close', this.closeEventListener);
      this.closeEventListener = null; // Reset the reference
    }

    if (this.ws) {
      this.ws.close();
      this.ws = null; // Reset the WebSocket reference for this instance
    }
  }

  close(event) {
    const today = new Date().toLocaleString("en-us");
    switch (event.code) {
      case 1000:
        console.log(`Connection closed with code ${event.code} at (${today}) - Normal closure`.green);
        break;
      case 1001:
        console.log(`Connection closed with code ${event.code} at (${today}) - Going Away`.green);
        break;
      case 1006:
        console.log(`Connection closed with code ${event.code} at (${today}) - Abnormal closure (no close frame received)`.red);
        break;
      case 1005:
        console.log(`Connection closed with code ${event.code} at (${today}) - No status received`.yellow);
        break;
      case 1008:
        console.log(`Connection closed with code ${event.code} at (${today}) - Policy Violation`.red);
        break;
      case 1011:
        console.log(`Connection closed with code ${event.code} at (${today}) - Unexpected condition prevented the request from being fulfilled`.red);
        break;
      default:
        console.error(`Connection closed with unexpected code ${event.code} at (${today})`.red);
        break;
    };
  };

  /**
   * Handle received data based on event type and associated intents.
   * @param {Object} data - The received data object.
   * @returns {void}
   */
  handleData(data) {
    const eventType = data._type;
    const intents = EventTypeIntents[eventType];
    if (intents) {
      for (const intent of intents) {
        if (this.intents.includes(intent)) {
          // Call the handleEvent function and pass the event type and data
          handleEvent.call(this, eventType, data);
          break;
        }
      }
    }
  }

  /**
  * Send a keep-alive request to the Highrise API.
  * @returns {void}
  */
  sendKeepalive() {
    if (this.ws && this.connected && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ _type: 'KeepaliveRequest', rid: generateRid() }));
    }

    clearTimeout(this.keepaliveInterval); // Clear the previous timeout, if any

    this.keepaliveInterval = setTimeout(() => {
      this.sendKeepalive();
    }, 15000);
  }


  /**
   * Attempt to reconnect to the Highrise API.
   * @returns {void}
   */
  reconnect() {
    if (!this.reconnecting) {
      this.reconnecting = true;
      console.log(`Attempting to reconnect in ${this.reconnectTimeoutDuration} seconds...`.yellow);

      clearTimeout(this.reconnectTimeout); // Clear the previous timeout, if any

      this.reconnectTimeout = setTimeout(() => {
        if (this.ws && this.ws.readyState === WebSocket.CLOSED) {
          // Clean up the existing WebSocket before reconnecting
          this.ws.removeEventListener('message', this.messageEventListener);
          this.ws.close();
        }

        // Reconnect using the stored token and roomId
        this.reconnecting = false;
        this.login(this.apiToken, this.roomId);
      }, this.reconnectTimeoutDuration * 1000); // Multiply by 1000 to convert seconds to milliseconds
    }
  }
}

module.exports = { Highrise };
