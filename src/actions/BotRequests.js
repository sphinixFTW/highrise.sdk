const { HighriseError } = require("../handlers/error");
const { GetWalletRequest, SendPayloadAndGetResponse, BuyVoiceTimeRequest, BuyRoomBoostRequest, GetInventoryRequest, BuyItemRequest, SetOutfitRequest } = require("../models/models");
const { generateRid, getBotInfo } = require("../utils/Utils");

class Client {
  constructor(bot) {
    this.bot = bot;
    this.rid = generateRid();
  }

  fetch() {
    return getBotInfo();
  }

  id = {
    get: () => {
      const info = getBotInfo();
      return info.id;
    }
  }

  position = {
    get: () => {
      const info = getBotInfo();
      return info.position;
    }
  }
}

class Outfit {
  constructor(bot) {
    this.bot = bot;
    this.rid = generateRid();

  }

  async change(outfit) {
    try {

      if (!outfit) {
        throw new HighriseError("Invalid outfit. Please make sure to use a valid outfit.".red)
      }
      const setOutfitRequest = new SetOutfitRequest(outfit, this.rid);

      const payload = {
        _type: 'SetOutfitRequest',
        outfit: setOutfitRequest.outfit,
        rid: setOutfitRequest.rid
      };

      if (this.bot.ws && this.bot.ws.readyState === this.bot.websocket.OPEN) {
        this.bot.ws.send(JSON.stringify(payload), (error) => {
          if (error) {
            console.error("Error sending SetOutfitRequest:".red, error);
            throw new HighriseError("Error sending SetOutfitRequest:".red)
          }
        });
      }
    } catch (error) {
      throw new HighriseError("Error executing SetOutfitRequest:", error);
    }
  }

}
class Item {
  constructor(bot) {
    this.bot = bot;
    this.rid = generateRid();
  }

  async buy(item_id) {
    try {

      if (!item_id) {
        throw new HighriseError("Invalid item_id. Please provide a valid item ID".red);
      }

      if (this.bot.ws && this.bot.ws.readyState === this.bot.websocket.OPEN) {
        // Create a BuyItemRequest object
        const buyItemRequest = new BuyItemRequest(item_id, this.rid);

        const payload = {
          _type: "BuyItemRequest",
          rid: buyItemRequest.rid,
          item_id: buyItemRequest.item_id
        };

        // Create an instance of SendPayloadAndGetResponse
        const sender = new SendPayloadAndGetResponse(this.bot);

        // Send the payload and get the response
        const response = await sender.sendPayloadAndGetResponse(
          payload,
          BuyItemRequest.Response
        );

        return response.result.result;
      }
    } catch (error) {
      throw new HighriseError("Error executing buy item request:", error);
    }
  }
}

class Inventory {
  constructor(bot) {
    this.bot = bot;
    this.rid = generateRid();
  }

  async get() {
    try {
      // Check if the WebSocket connection is open
      if (this.bot.ws && this.bot.ws.readyState === this.bot.websocket.OPEN) {
        const getInventoryRequest = new GetInventoryRequest(this.rid);

        // Prepare the payload for the request
        const payload = {
          _type: "GetInventoryRequest",
          rid: getInventoryRequest.rid
        };

        // Create an instance of SendPayloadAndGetResponse
        const sender = new SendPayloadAndGetResponse(this.bot);

        // Send the payload and get the response
        const response = await sender.sendPayloadAndGetResponse(
          payload,
          GetInventoryRequest.Response
        );

        // Return the inventory data
        return response.items.items;
      }
    } catch (error) {
      throw new HighriseError("Error fetching inventory request:", error);
    }
  }
}
class Wallet {
  constructor(bot) {
    this.bot = bot;
    this.rid = generateRid();
  }

  buy = {
    /**
    * Buys voice time using the specified payment method.
    *
    * @param {string} [payment_method='bot_wallet_priority'] - The payment method to use. Defaults to 'bot_wallet_priority'.
    * @returns {Promise<number>} - A Promise that resolves to the result of the voice time purchase.
    */
    voice: async (payment_method = 'bot_wallet_priority') => {
      try {
        // Validate the payment method
        const validPaymentMethods = ["bot_wallet_only", "bot_wallet_priority", "user_wallet_only"];
        if (!validPaymentMethods.includes(payment_method)) {
          throw new HighriseError(`Invalid payment method:`.red + "\n" + `${validPaymentMethods.join("\n")}`.green);
        }

        // Check if the WebSocket connection is open
        if (this.bot.ws && this.bot.ws.readyState === this.bot.websocket.OPEN) {
          // Create a BuyVoiceTimeRequest object
          const buyVoiceTimeRequest = new BuyVoiceTimeRequest(payment_method, this.rid);

          // Prepare the payload for the request
          const payload = {
            _type: "BuyVoiceTimeRequest",
            rid: buyVoiceTimeRequest.rid,
            payment_method: buyVoiceTimeRequest.payment_method
          };

          // Create an instance of SendPayloadAndGetResponse
          const sender = new SendPayloadAndGetResponse(this.bot);

          // Send the payload and get the response
          const response = await sender.sendPayloadAndGetResponse(
            payload,
            BuyVoiceTimeRequest.Response
          );

          // Return the result of the voice time purchase
          return response.result.result;
        }
      } catch (error) {
        console.error(error);
      }
    },

    /**
    * Boosts the room using the specified payment method and amount.
    *
    * @param {string} [payment_method='bot_wallet_priority'] - The payment method to use. Defaults to 'bot_wallet_priority'.
    * @param {number} [amount=1] - The amount of currency to use for the boost. Defaults to 1.
    * @returns {Promise<number>} - A Promise that resolves to the result of the boost operation.
    */
    boost: async (payment_method = 'bot_wallet_priority', amount = 1) => {
      try {
        // Validate the payment method
        const validPaymentMethods = ["bot_wallet_only", "bot_wallet_priority", "user_wallet_only"];
        if (!validPaymentMethods.includes(payment_method)) {
          throw new HighriseError(`Invalid payment method:`.red + "\n" + `${validPaymentMethods.join("\n")}`.green);
        }

        // Check if the amount is a valid integer
        if (!Number.isInteger(amount)) {
          throw new HighriseError("Invalid currency amount.".red);
        }

        // Check if the WebSocket connection is open
        if (this.bot.ws && this.bot.ws.readyState === this.bot.websocket.OPEN) {
          // Create a BuyRoomBoostRequest object
          const buyRoomBoostRequest = new BuyRoomBoostRequest(payment_method, amount, this.rid);

          // Prepare the payload for the request
          const payload = {
            _type: "BuyRoomBoostRequest",
            rid: buyRoomBoostRequest.rid,
            payment_method: buyRoomBoostRequest.payment_method,
            amount: buyRoomBoostRequest.amount
          };

          // Create an instance of SendPayloadAndGetResponse
          const sender = new SendPayloadAndGetResponse(this.bot);

          // Send the payload and get the response
          const response = await sender.sendPayloadAndGetResponse(
            payload,
            BuyRoomBoostRequest.Response
          );

          // Return the result of the room boost
          return response.result.result;
        }
      } catch (error) {
        console.error(error);
      }
    }
  }

  async fetch() {
    try {
      // Check if the WebSocket connection is open
      if (this.bot.ws && this.bot.ws.readyState === this.bot.websocket.OPEN) {
        // Create a GetWalletRequest object
        const getWalletRequest = new GetWalletRequest(this.rid);

        // Prepare the payload for the request
        const payload = {
          _type: "GetWalletRequest",
          rid: getWalletRequest.rid
        };

        // Create an instance of SendPayloadAndGetResponse
        const sender = new SendPayloadAndGetResponse(this.bot);

        // Send the payload and get the response
        const response = await sender.sendPayloadAndGetResponse(
          payload,
          GetWalletRequest.Response
        );

        // Store the wallet data
        this.walletData = response.content.content;

        // Return the wallet data
        return this.walletData;
      }
    } catch (error) {
      throw new HighriseError("Error fetching wallet request:", error);
    }
  }

  get = {
    gold: {
      amount: async () => {
        try {
          if (!this.walletData) {
            await this.fetch();
          }
          const goldAmount = this.walletData.find(item => item.type === 'gold')?.amount || 0;
          return goldAmount;
        } catch (error) {
          console.error(error);
        }
      }
    },
    boost: {
      amount: async () => {
        try {
          if (!this.walletData) {
            await this.fetch();
          }
          const boostAmount = this.walletData.find(item => item.type === 'room_boost_tokens')?.amount || 0;
          return boostAmount;
        } catch (error) {
          console.error(error);
        }
      },
      type: async () => {
        try {
          if (!this.walletData) {
            await this.fetch();
          }
          const boostType = this.walletData.find(item => item.type === 'room_boost_tokens')?.type || '';
          return boostType;
        } catch (error) {
          console.error(error);
        }
      }
    },
    voice: {
      amount: async () => {
        try {
          if (!this.walletData) {
            await this.fetch();
          }
          const voiceAmount = this.walletData.find(item => item.type === 'room_voice_tokens')?.amount || 0;
          return voiceAmount;
        } catch (error) {
          console.error(error);
        }
      },
      type: async () => {
        try {
          if (!this.walletData) {
            await this.fetch();
          }
          const voiceType = this.walletData.find(item => item.type === 'room_voice_tokens')?.type || '';
          return voiceType;
        } catch (error) {
          console.error(error);
        }
      }
    }
  };

}

module.exports = { Wallet, Inventory, Item, Outfit, Client };