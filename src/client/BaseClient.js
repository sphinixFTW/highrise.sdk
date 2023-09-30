const EventEmitter = require("events")
const { ChatRequest } = require('../models/models');
const { HighriseError } = require('../handlers/error');
const { generateRid } = require("../utils/Utils");


const { DirectMessages } = require("../actions/DirectMessages");
const { Wallet, Inventory, Item, Outfit, Client } = require("../actions/BotRequests");
const { VoiceChat } = require("../actions/GetVoiceChatRequest");
const { Move } = require("../actions/FloorHitRequest");
const { Users } = require("../actions/UserRequests");
const { RoomUsers } = require("../actions/GetRoomUsersRequest");
const { AwaitEvents } = require("../actions/awaitEvent");

class HighriseClient extends EventEmitter {
  /**
   * @class HighriseClient
   * Represents a Highrise bot client.
   * Extends the EventEmitter class for event handling.
   * @param {Object} options - Options for the Highrise bot.
   * @param {number} [reconnectDuration=5] - Duration in seconds for reconnection attempts.
   * @param {WebSocket} ws - The WebSocket instance.
   * @param {WebSocket} websocket - The WebSocket class.
   */
  constructor(options = {}, reconnectDuration = 5, ws, websocket) {
    super();
    // Add any additional properties or initialization logic if needed

    // Bot options
    this.intents = options.intents || [];
    this.cache = options.cache || false;

    // Post methods
    this.room = {
      players: new RoomUsers(this),
      voice: new VoiceChat(this)
    }
    this.inbox = new DirectMessages(this);
    this.chat = new AwaitEvents(this);
    this.wallet = new Wallet(this);
    this.inventory = new Inventory(this);
    this.items = new Item(this);
    this.outfit = new Outfit(this);
    this.client = new Client(this);
    this.move = new Move(this);
    this.player = new Users(this);
    this.ws = ws;
    this.websocket = websocket;
  }

  /**
  * Sends a message through the WebSocket connection.
  * @param {Object} message - The message object to send.
  * @param {string} message.message - The content of the message.
  * @param {string} [message.receiver] - The ID of the message receiver (optional, for whisper messages).
  * @param {boolean} [message.whisper] - Indicates if the message is a whisper message (optional).
  * @throws {HighriseError} If the message is empty or the WebSocket is not open.
  */
  sendMessage(message) {
    try {
      if (!message) {
        throw new HighriseError(`[WARNING]: You can't send an empty message.`.red);
      }

      if (this.ws && this.ws.readyState === this.websocket.OPEN) {
        let payload;
        if (message.whisper) {
          const chatRequest = new ChatRequest(message.message, message.receiver, generateRid());
          payload = {
            _type: 'ChatRequest',
            message: chatRequest.message,
            whisper_target_id: chatRequest.whisper_target_id,
            rid: chatRequest.rid
          };
        } else {
          const chatRequest = new ChatRequest(message.message, null, generateRid());
          payload = {
            _type: 'ChatRequest',
            message: chatRequest.message,
            rid: chatRequest.rid
          };
        }

        this.ws.send(JSON.stringify(payload));
      } else {
        return console.error("WebSocket is not open. Message cannot be sent.".red);
      }
    } catch (error) {
      throw new HighriseError("Error sending message request:", error);
    }
  }

  /**
  * Sends a private invitation through the WebSocket connection.
  * @param {string} conversation_id - The ID of the conversation.
  * @param {string} room_id - The ID of the room.
  * @throws {HighriseError} If the WebSocket is not open.
  */
  sendPrivateInvite(conversation_id, room_id) {
    try {
      if (this.ws && this.ws.readyState === this.websocket.OPEN) {
        const payload = {
          _type: 'SendMessageRequest',
          conversation_id: conversation_id,
          content: '',
          type: 'invite',
          room_id: room_id,
          rid: generateRid()
        };
        this.ws.send(JSON.stringify(payload));
      }
    } catch (error) {
      throw new HighriseError("Error sending invite request:", error);
    }
  }

  /**
  * Sends a private message through the WebSocket connection.
  * @param {string} conversation_id - The ID of the conversation.
  * @param {string} content - The content of the message.
  * @throws {HighriseError} If the WebSocket is not open.
  */
  sendPrivateMessage(conversation_id, content) {
    try {
      if (this.ws && this.ws.readyState === this.websocket.OPEN) {
        const payload = {
          _type: 'SendMessageRequest',
          conversation_id: conversation_id,
          content: content,
          type: 'text',
          room_id: null,
          rid: generateRid()
        };
        this.ws.send(JSON.stringify(payload));
      }
    } catch (error) {
      throw new HighriseError("Error sending private message request:", error);
    }
  }

  message = {
    /**
     * Sends a regular message.
     *
     * @param {string} message - The message content to send.
     */
    send: (message) => {
      try {
        if (!message || typeof message !== 'string') {
          throw new HighriseError(`[WARNING]: You can't send an empty message.`.red);
        }
        this.sendMessage({
          message: message
        });
      } catch (error) {
        console.error(`An error occurred:`, error);
      }
    }
  }

  whisper = {
    /**
     * Sends a whispered message to a specific user.
     *
     * @param {string} user_id - The ID of the user to send the message to.
     * @param {string} message - The message content to send.
     */
    send: (user_id, message) => {
      try {
        if (!user_id || typeof user_id !== 'string') {
          throw new HighriseError(`[WARNING]: Invalid user ID. Please provide a valid value for the user ID.`.red);
        }
        if (!message || typeof message !== 'string') {
          throw new HighriseError(`[WARNING]: You can't send an empty message.`.red);
        }
        this.sendMessage({
          message: message,
          receiver: user_id,
          whisper: true
        });
      } catch (error) {
        console.error(`An error occurred:`, error);
      }
    }
  }

  invite = {
    /**
     * Sends an invite to a private conversation in a room.
     *
     * @param {string} conversation_id - The ID of the conversation to invite to.
     * @param {string} room_id - The ID of the room where the conversation is located.
     */
    send: (conversation_id, room_id) => {
      try {
        if (!conversation_id || typeof conversation_id !== 'string') {
          throw new HighriseError('[WARNING]: Invalid conversation ID. Please provide a valid value for the conversation ID.'.red);
        }
        if (!room_id || typeof room_id !== 'string') {
          throw new HighriseError('[WARNING]: Invalid room ID. Please provide a valid value for the room ID.'.red);
        }
        this.sendPrivateInvite(conversation_id, room_id);
      } catch (error) {
        console.error(`An error occurred:`, error);
      }
    }
  }

  direct = {
    /**
     * Sends a direct message to a private conversation.
     *
     * @param {string} conversation_id - The ID of the conversation to send the message to.
     * @param {*} content - The content of the message to send.
     */
    send: (conversation_id, content) => {
      try {
        if (!conversation_id || typeof conversation_id !== 'string') {
          throw new HighriseError('[WARNING]: Invalid conversation ID. Please provide a valid value for the conversation ID.'.red);
        }
        if (!content) {
          throw new HighriseError(`[WARNING]: You can't send an empty message.`.red);
        }
        this.sendPrivateMessage(conversation_id, content);
      } catch (error) {
        console.error(`An error occurred:`, error);
      }
    }
  }
}

module.exports = HighriseClient;
