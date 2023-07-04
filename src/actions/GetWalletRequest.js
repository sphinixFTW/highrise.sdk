const { HighriseError } = require("../handlers/error");
const { GetWalletRequest, SendPayloadAndGetResponse, BuyVoiceTimeRequest, BuyRoomBoostRequest } = require("../models/models");
const { generateRid } = require("../utils/Utils");

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
        if (this.bot.ws.readyState === this.bot.websocket.OPEN) {
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
        if (this.bot.ws.readyState === this.bot.websocket.OPEN) {
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
      if (this.bot.ws.readyState === this.bot.websocket.OPEN) {
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

module.exports = { Wallet };