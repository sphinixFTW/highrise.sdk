/**
 * Handles the roomModerate event by emitting relevant information.
 *
 * @param {Object} data - The data object containing information about the moderation event.
 * @param {function} emit - The function used to emit the roomModerate event with processed data.
 */
function handleRoomModerateEvent(data, emit) {
  try {
    // Extract information from the data object
    const moderatorId = data.moderatorId;
    const targetUserId = data.targetUserId;
    const moderationType = data.moderationType;
    const duration = data.duration;

    // Emit the roomModerate event with extracted information
    emit('roomModerate', moderatorId, targetUserId, moderationType, duration);
  } catch (error) {
    console.error("Error occurred while handling room moderate event:", error);
  }
}

module.exports = handleRoomModerateEvent;
