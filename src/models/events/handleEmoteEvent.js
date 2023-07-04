const { User } = require("../models");

/**
 * Handles the emote event.
 *
 * @param {object} data - The event data.
 * @param {Function} emit - The emit function to trigger events.
 * @returns {void}
 */
function handleEmoteEvent(data, emit) {
  try {
    const sender = new User(data.user.id, data.user.username);
    const receiver = new User(data.receiver.id, data.receiver.username);
    const emoteId = data.emote_id;

    emit('playerEmote', sender, receiver, emoteId);
  } catch (error) {
    console.error("Error occurred while handling emote event:", error);
  }
}

module.exports = handleEmoteEvent;
