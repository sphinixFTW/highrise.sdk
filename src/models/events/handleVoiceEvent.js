const { User } = require("../models");

/**
 * Handles the voice chat event.
 *
 * @param {object} data - The event data.
 * @param {function} emit - The emit function to trigger events.
 * @returns {void}
 */
function handleVoiceEvent(data, emit) {
  try {
    const { users, seconds_left } = data;

    const formattedUsers = users.map(([userData, status]) => ({
      user: new User(userData.id, userData.username),
      status: status
    }));

    emit('voiceCreate', formattedUsers, seconds_left);

  } catch (error) {
    console.error("Error occurred while handling voice chat event:", error);
  }
}

module.exports = handleVoiceEvent;
