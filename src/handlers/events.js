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
const handleRoomModerateEvent = require("../models/events/handleModerationEvents");

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

    switch (eventType) {
      case 'SessionMetadata':
        handleReadyEvent(data, emit);
        break;
      case 'ChatEvent':
        handleChatEvent(data, emit);
        break;
      case 'MessageEvent':
        handleDMEvent(data, emit);
        break;
      case 'UserJoinedEvent':
        handleUserJoinedEvent(data, emit);
        break;
      case 'UserLeftEvent':
        handleUserLeftEvent(data, emit);
        break;
      case 'EmoteEvent':
        handleEmoteEvent(data, emit);
        break;
      case 'ReactionEvent':
        handleReactEvent(data, emit);
        break;
      case 'TipReactionEvent':
        handleTipsEvent(data, emit);
        break;
      case 'UserMovedEvent':
        handleMovementEvent(data, emit);
        break;
      case 'VoiceEvent':
        handleVoiceEvent(data, emit);
        break;
      case 'Error':
        handleErrorEvent(data, emit);
        break;
      case 'RoomModeratedEvent':
        handleRoomModerateEvent(data, emit);
        break;
      default:
        // Handle unknown event type
        console.warn(`Unknown event type: ${eventType}`);
    }
  } catch (error) {
    console.error(`Error occurred while handling the API events:`, error);
  }
}

module.exports = handleEvent;
