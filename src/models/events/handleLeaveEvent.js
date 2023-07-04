const { User } = require("../models");

/**
 * Handles the user left event.
 *
 * @param {object} data - The event data.
 * @param {Function} emit - The emit function to trigger events.
 * @returns {void}
 */
function handleUserLeftEvent(data, emit) {
  try {
    // If a user left event was received, create a User object and emit a playerLeave event

    const user = new User(data.user.id, data.user.username);
    emit('playerLeave', user);
  } catch (error) {
    console.error("Error occurred while handling user leave event:", error);
  }
}

module.exports = handleUserLeftEvent;
