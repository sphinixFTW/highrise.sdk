const CachedRoomUsers = new Map();

module.exports = {
  CachedRoomUsers,
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
