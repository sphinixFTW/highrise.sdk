const { HighriseError } = require("../handlers/error");
const { GetConversationsRequest, GetMessagesRequest, LeaveConversationRequest, SendPayloadAndGetResponse } = require("../models/models");
const { generateRid } = require("../utils/Utils");

class DirectMessages {
  constructor(bot) {
    this.bot = bot;
    this.rid = generateRid();
  }

  conversations = {
    /**
     * Get conversations.
     * @param {boolean} not_joined - Indicates whether to include only joined conversations. Default is false.
     * @param {string|null} last_id - The ID of the last conversation received. Default is null.
     * @returns {Array} - An array of conversations.
     */
    get: async (not_joined = false, last_id = null) => {
      try {
        if (this.bot.ws && this.bot.ws.readyState === this.bot.websocket.OPEN) {
          const getDmRequest = new GetConversationsRequest(not_joined, last_id, this.rid);
          const payload = {
            _type: "GetConversationsRequest",
            rid: getDmRequest.rid,
            not_joined: getDmRequest.not_joined,
            last_id: getDmRequest.last_id
          };

          const sender = new SendPayloadAndGetResponse(this.bot); // Create an instance of SendPayloadAndGetResponse
          const response = await sender.sendPayloadAndGetResponse(
            payload,
            GetConversationsRequest.Response
          );

          return response.conversations.conversations;
        } else {
          console.error("Error: WebSocket is not open: readyState 2".red);
          return null;
        }
      } catch (error) {
        throw new HighriseError("Error fetching room users:", error);
      }
    }
  };


  messages = {
    /**
    * Gets the messages from a conversation.
    * @param {GetMessagesParams} params - Parameters for retrieving messages.
    * @returns {Promise<Array>} - A promise that resolves to an array of messages.
    * @throws {HighriseError} - If there is an error fetching the messages.
    */
    get: async (conversation_id, last_message_id = null) => {
      try {
        if (this.bot.ws && this.bot.ws.readyState === this.bot.websocket.OPEN) {
          const getMessagesRequest = new GetMessagesRequest(conversation_id, last_message_id, this.rid);
          const payload = {
            _type: "GetMessagesRequest",
            rid: getMessagesRequest.rid,
            conversation_id: conversation_id,
            last_message_id: last_message_id
          };

          const sender = new SendPayloadAndGetResponse(this.bot); // Create an instance of SendPayloadAndGetResponse

          const response = await sender.sendPayloadAndGetResponse(
            payload,
            GetMessagesRequest.Response
          );

          return response.messages.messages;
        } else {
          console.error("Error: WebSocket is not open: readyState 2".red);
          return null;
        }
      } catch (error) {
        throw new HighriseError("Error fetching messages:", error);
      }
    }
  }

  /**
  * Leaves a conversation.
  * @param {string} conversation_id - The ID of the conversation to leave.
  * @throws {HighriseError} - If there is an error leaving the conversation.
  */
  async leave(conversation_id) {
    try {
      // Check if the conversation_id is valid
      if (!conversation_id || typeof conversation_id !== 'string') {
        throw new HighriseError('Invalid conversation ID. Please provide a valid value for the conversation ID.'.red);
      }

      const leaveConversationRequest = new LeaveConversationRequest(conversation_id, this.rid);

      const payload = {
        _type: 'LeaveConversationRequest',
        conversation_id: leaveConversationRequest.conversation_id,
        rid: leaveConversationRequest.rid
      };

      // Check if the WebSocket connection is open
      if (this.bot.ws && this.bot.ws.readyState === this.bot.websocket.OPEN) {
        // Send the leaveConversationRequest payload
        this.bot.ws.send(JSON.stringify(payload), (error) => {
          if (error) {
            throw new HighriseError("Error sending leaveConversationRequest:".red);
          }
        });
      }
    } catch (error) {
      throw new HighriseError("Error leaving conversation:", error);
    }
  }

}

module.exports = { DirectMessages };
