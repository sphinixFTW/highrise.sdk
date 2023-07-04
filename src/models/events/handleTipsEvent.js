const { User, CurrencyItem } = require("../models");

/**
 * Handles the tips event.
 *
 * @param {object} data - The event data.
 * @param {function} emit - The emit function to trigger events.
 * @returns {void}
 */
function handleTipsEvent(data, emit) {
  try {
    const sender = new User(data.sender.id, data.sender.username);
    const receiver = new User(data.receiver.id, data.receiver.username);
    const item = new CurrencyItem(data.item.type, data.item.amount);

    emit('playerTip', sender, receiver, item);
  } catch (error) {
    console.error("Error occurred while handling tips event:", error);
  }
}

module.exports = handleTipsEvent;
