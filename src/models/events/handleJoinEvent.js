const { User } = require("../models");

/**
 * Handles the user joined event.
 *
 * @param {object} data - The event data.
 * @param {function} emit - The emit function to trigger events.
 * @returns {void}
 */
function handleUserJoinedEvent(data, emit) {
  try {
    const user = new User(data.user.id, data.user.username);
    emit('playerJoin', user);
  } catch (error) {
    console.error("Error occurred while handling user join event:", error);
  }
}

module.exports = handleUserJoinedEvent;
