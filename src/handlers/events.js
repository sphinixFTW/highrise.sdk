// Import the event handler functions
const handleChatEvent = require("../models/events/handleChatEvent");
const handleUserJoinedEvent = require("../models/events/handleJoinEvent");
const handleUserLeftEvent = require("../models/events/handleLeaveEvent");
const handleEmoteEvent = require("../models/events/handleEmoteEvent");
const handleReadyEvent = require("../models/events/handleReadyEvent");
const handleReactEvent = require("../models/events/handleReactEvent");
const handleTipsEvent = require("../models/events/handleTipsEvent");
const handleMovementEvent = require("../models/events/handleMovementEvent");
const handleVoiceEvent = require("../models/events/handleVoiceEvent");
const handleDMEvent = require("../models/events/handleDMEvent");
const handleErrorEvent = require("../models/events/handleErrorEvent");

// Import other event handlers as needed

/**
 * Handles the API events based on the event type.
 *
 * @param {string} eventType - The type of the event.
 * @param {object} data - The event data.
 * @returns {void}
 */
function handleEvent(eventType, data) {
  try {
    const emit = this.emit.bind(this);

    if (eventType === 'SessionMetadata') {
      handleReadyEvent(data, emit);
    } else if (eventType === 'ChatEvent') {
      handleChatEvent(data, emit);
    } else if (eventType === 'MessageEvent') {
      handleDMEvent(data, emit);
    } else if (eventType === 'UserJoinedEvent') {
      handleUserJoinedEvent(data, emit)
    } else if (eventType === 'UserLeftEvent') {
      handleUserLeftEvent(data, emit)
    } else if (eventType === 'EmoteEvent') {
      handleEmoteEvent(data, emit)
    } else if (eventType === 'ReactionEvent') {
      handleReactEvent(data, emit)
    } else if (eventType === 'TipReactionEvent') {
      handleTipsEvent(data, emit)
    } else if (eventType === 'UserMovedEvent') {
      handleMovementEvent(data, emit)
    } else if (eventType === 'VoiceEvent') {
      handleVoiceEvent(data, emit)
    } else if (eventType === 'Error') {
      handleErrorEvent(data, emit);
    }
  } catch (error) {
    console.error(`Error occurred while handling the API events:`, error);
  }
}

module.exports = handleEvent;
