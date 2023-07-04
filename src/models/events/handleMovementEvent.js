const { User, Position, AnchorPosition } = require("../models");

/**
 * Handles the movement event for a user.
 *
 * @param {object} data - The event data.
 * @param {function} emit - The emit function to trigger events.
 * @returns {void}
 */
function handleMovementEvent(data, emit) {
  try {
    const user = new User(data.user.id, data.user.username);
    if ('x' in data.position && 'y' in data.position && 'z' in data.position) {
      const destination = new Position(data.position.x, data.position.y, data.position.z, data.position.facing);
      emit('playerMove', user, destination);
    } else if ('entity_id' in data.position && 'anchor_ix' in data.position) {
      const anchor = new AnchorPosition(data.position.entity_id, data.position.anchor_ix);
      emit('playerMove', user, anchor);
    }
  } catch (error) {
    console.error("Error occurred while handling track player movement event:", error);
  }
}

module.exports = handleMovementEvent;
