const { GatewayIntentBits } = require("../utils/GatewayIntents");

class AwaitEvents {
  constructor(bot) {
    this.bot = bot;
    this.messageListeners = new Map();
    this.reactionListeners = new Map();
    this.emoteListeners = new Map();
    this.tipsListeners = new Map();
    this.intents = bot.intents || [];

    if (this.intents.includes(GatewayIntentBits.Messages)) {
      this.bot.on('chatCreate', this.handleChatMessageCreate.bind(this));
      this.bot.on('whisperCreate', this.handleChatMessageCreate.bind(this));
    }
    if (this.intents.includes(GatewayIntentBits.Reactions)) {
      this.bot.on('playerReact', this.handleReactionCreate.bind(this));
    }
    if (this.intents.includes(GatewayIntentBits.Emotes)) {
      this.bot.on('playerEmote', this.handleEmoteCreate.bind(this));
    }
    if (this.intents.includes(GatewayIntentBits.Tips)) {
      this.bot.on('playerTip', this.handleTipsCreate.bind(this));
    }
  }

  handleChatMessageCreate(user, message) {
    // Notify all message listeners
    for (const listener of this.messageListeners.keys()) {
      listener(user, message);
    }
  }

  handleEmoteCreate(sender, receiver, emote) {
    // Notify all emotes listeners
    for (const listener of this.emoteListeners.keys()) {
      listener(sender, receiver, emote);
    }
  }

  handleReactionCreate(sender, receiver, reaction) {
    // Notify all reaction listeners
    for (const listener of this.reactionListeners.keys()) {
      listener(sender, receiver, reaction);
    }
  }

  handleTipsCreate(sender, receiver, item) {
    // Notify all tips listeners
    for (const listener of this.tipsListeners.keys()) {
      listener(sender, receiver, item);
    }
  }

  /**
  * Waits for and collects messages that meet the specified criteria.
  *
  * @param {object} options - The options for message collection.
  * @param {function} options.filter - The filter function to apply to each message.
  * @param {number} options.max - The maximum number of messages to collect.
  * @param {number} options.idle - The idle time in milliseconds after which message collection should stop.
  * @returns {Promise<Array<{user: object, message: object}>>} - A promise that resolves with the collected messages.
  */
  awaitMessages(options) {
    const { filter, max, idle } = options;

    return new Promise((resolve) => {
      let timer;
      let collected = [];
      let uniqueUsers = new Set();

      const listener = (user, message) => {
        if ((!filter || filter(user, message)) && !uniqueUsers.has(user.id)) {
          collected.push({ user, message });
          uniqueUsers.add(user.id);
        }

        if (max && collected.length >= max) {
          clearTimeout(timer);
          this.removeMessageListener(listener);
          resolve(collected);
        }
      };

      this.addMessageListener(listener);

      timer = setTimeout(() => {
        this.removeMessageListener(listener);
        resolve(collected);
      }, idle);
    });
  }

  /**
  * Waits for and collects reactions that meet the specified criteria.
  *
  * @param {object} options - The options for reaction collection.
  * @param {function} options.filter - The filter function to apply to each reaction.
  * @param {boolean} options.max - Specifies whether to collect at most one reaction per user.
  * @param {number} options.idle - The idle time in milliseconds after which reaction collection should stop.
  * @returns {Promise<Array<{sender: object, receiver: object, reaction: object}>>} - A promise that resolves with the collected reactions.
  */
  awaitReactions(options) {
    const { filter, max, idle } = options;

    return new Promise((resolve) => {
      let timer;
      let collected = [];
      let uniqueUsers = new Set();

      const listener = (sender, receiver, reaction) => {
        if ((!filter || filter(sender, receiver, reaction)) && !uniqueUsers.has(sender.id)) {
          collected.push({ sender, receiver, reaction });
          uniqueUsers.add(sender.id);
        }

        if (max === true && collected.length >= uniqueUsers.size) {
          clearTimeout(timer);
          this.removeReactionListener(listener);
          resolve(collected);
        }
      };

      this.addReactionListener(listener);

      timer = setTimeout(() => {
        this.removeReactionListener(listener);
        resolve(collected);
      }, idle);
    });
  }

  /**
  * Waits for and collects emotes that meet the specified criteria.
  *
  * @param {object} options - The options for emote collection.
  * @param {function} options.filter - The filter function to apply to each emote.
  * @param {number} options.max - The maximum number of emotes to collect.
  * @param {number} options.idle - The idle time in milliseconds after which emote collection should stop.
  * @returns {Promise<Array<{sender: object, receiver: object, emote: object}>>} - A promise that resolves with the collected emotes.
  */
  awaitEmotes(options) {
    const { filter, max, idle } = options;

    return new Promise((resolve) => {
      let timer;
      let collected = [];
      let uniqueUsers = new Set();

      const listener = (sender, receiver, emote) => {
        if ((!filter || filter(sender, receiver, emote)) && !uniqueUsers.has(sender.id)) {
          collected.push({ sender, receiver, emote });
          uniqueUsers.add(sender.id);
        }

        if (max && collected.length >= max) {
          clearTimeout(timer);
          this.removeEmoteListener(listener);
          resolve(collected);
        }
      };

      this.addEmoteListener(listener);

      timer = setTimeout(() => {
        this.removeEmoteListener(listener);
        resolve(collected);
      }, idle);
    });
  }

  /**
  * Waits for and collects tips that meet the specified criteria.
  *
  * @param {object} options - The options for tip collection.
  * @param {function} options.filter - The filter function to apply to each tip.
  * @param {number} options.max - The maximum number of tips to collect.
  * @param {number} options.idle - The idle time in milliseconds after which tip collection should stop.
  * @returns {Promise<Array<{sender: object, receiver: object, item: object}>>} - A promise that resolves with the collected tips.
  */
  awaitTips(options) {
    const { filter, max, idle } = options;

    return new Promise((resolve) => {
      let timer;
      let collected = [];

      const listener = (sender, receiver, item) => {
        if (!filter || filter(sender, receiver, item)) {
          collected.push({ sender, receiver, item });

          if (max && collected.length >= max) {
            clearTimeout(timer);
            this.removeTipsListener(listener);
            resolve(collected);
          }
        }
      };

      this.addTipsListener(listener);

      timer = setTimeout(() => {
        this.removeTipsListener(listener);
        resolve(collected);
      }, idle);
    });
  }


  addTipsListener(listener) {
    this.tipsListeners.set(listener, true);
  }

  removeTipsListener(listener) {
    this.tipsListeners.delete(listener);
  }

  addEmoteListener(listener) {
    this.emoteListeners.set(listener, true);
  }

  removeEmoteListener(listener) {
    this.emoteListeners.delete(listener);
  }

  addReactionListener(listener) {
    this.reactionListeners.set(listener, true);
  }

  removeReactionListener(listener) {
    this.reactionListeners.delete(listener);
  }

  addMessageListener(listener) {
    this.messageListeners.set(listener, true);
  }

  removeMessageListener(listener) {
    this.messageListeners.delete(listener);
  }
}

module.exports = { AwaitEvents };
