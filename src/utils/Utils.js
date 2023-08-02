const CachedRoomUsers = new Map();
const bot_info = {
  id: null,
  position: null
};

module.exports = {
  CachedRoomUsers,
  updateBotId: (new_id) => {
    bot_info.id = new_id
  },

  updateBotPosition: (new_position) => {
    bot_info.position = new_position
  },

  getBotInfo: () => {
    return bot_info
  },

  generateRid: () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const length = 8;
    let rid = '';

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      rid += characters.charAt(randomIndex);
    }
    return rid;
  },
  packageVersion: () => {
    const packageJson = require("../../package.json");
    const version = packageJson.version;

    return version;
  }
}
