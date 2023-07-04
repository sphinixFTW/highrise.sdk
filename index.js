'use strict';

const WebApi = require("./src/client/WebApi");
const Highrise = require('./src/client/Highrise');
const { GatewayIntentBits } = require('./src/utils/GatewayIntents');

require("colors");
module.exports = {
  Highrise, GatewayIntentBits, WebApi: new WebApi()
};
