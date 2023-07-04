const { User } = require("../models");

/**
 * Handles the reaction event.
 *
 * @param {object} data - The event data.
 * @param {function} emit - The emit function to trigger events.
 * @returns {void}
 */
function handleReactEvent(data, emit) {
  try {
    const sender = new User(data.user.id, data.user.username);
    const receiver = new User(data.receiver.id, data.receiver.username);
    const reaction = data.reaction;

    emit('playerReact', sender, receiver, reaction);
  } catch (error) {
    console.error("Error occurred while handling reaction event:", error);
  }
}

module.exports = handleReactEvent;
