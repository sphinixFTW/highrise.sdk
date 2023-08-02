const axios = require('axios');
const { SessionMetadata } = require('../models');
const { packageVersion, updateBotId } = require('../../utils/Utils');

/**
 * Handles the ready event.
 *
 * @param {object} data - The event data.
 * @param {function} emit - The emit function to trigger events.
 * @returns {void}
 */
async function handleReadyEvent(data, emit) {
  try {
    const packageName = 'highrise.sdk';

    const response = await axios.get(`https://registry.npmjs.org/${packageName}`);
    const packageData = response.data;
    const latestVersion = packageData['dist-tags'].latest;

    const currentVersion = packageVersion();

    if (latestVersion !== currentVersion) {
      console.warn(`[WARNING]:`.red + ` You are using version ` + `${currentVersion}`.yellow + ` of highrise.sdk. The latest version is ` + `${latestVersion}`.green + ` Consider updating by running ` + `npm install highrise.sdk@latest`.green);
    }

    const session = new SessionMetadata(
      data.user_id,
      data.room_info,
      data.rate_limits,
      data.connection_id,
      currentVersion
    );

    if (session) {
      emit('ready', session);
      updateBotId(data.user_id);
    }
  } catch (error) {
    console.error('Error occurred while handling ready event:', error);
    return null;
  }
}

module.exports = handleReadyEvent;
