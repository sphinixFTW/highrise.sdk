/**
 * Handles the direct message event.
 *
 * @param {object} data - The event data.
 * @param {function} emit - The emit function to trigger events.
 * @returns {void}
 */
function handleErrorEvent(data, emit) {
  try {

    emit('error', data.message);
  } catch (error) {
    console.error("Error occurred while handling error event:", error);
  }
}

module.exports = handleErrorEvent;
