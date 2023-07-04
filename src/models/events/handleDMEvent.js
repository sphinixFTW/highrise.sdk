/**
 * Handles the direct message event.
 *
 * @param {object} data - The event data.
 * @param {function} emit - The emit function to trigger events.
 * @returns {void}
 */
function handleDMEvent(data, emit) {
  try {
    const conversation = {
      id: data.conversation_id,
      isNew: data.is_new_conversation
    };

    emit('messageCreate', data.user_id, conversation);
  } catch (error) {
    console.error("Error occurred while handling direct message event:", error);
  }
}

module.exports = handleDMEvent;
