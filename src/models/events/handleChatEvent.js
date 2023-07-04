const { User } = require("../models");

/**
 * Handles the chat event.
 *
 * @param {object} data - The event data.
 * @param {function} emit - The emit function to trigger events.
 * @returns {void}
 */
function handleChatEvent(data, emit) {
  try {
    const user = new User(data.user.id, data.user.username);
    const message = typeof data.message === 'string' ? data.message : data.message.text;

    if (data.whisper === false) {
      emit('chatCreate', user, message);
    } else {
      emit('whisperCreate', user, message);
    }
  } catch (error) {
    console.error("Error occurred while handling chat event:", error);
  }
}

module.exports = handleChatEvent;
