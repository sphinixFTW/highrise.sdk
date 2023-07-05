'use strict';

const WebApi = require("./src/client/WebApi");
const { GatewayIntentBits } = require('./src/utils/GatewayIntents');
const { Highrise } = require("./src/client/Highrise");

require("colors");
module.exports = {
  Highrise, GatewayIntentBits, WebApi: new WebApi()
};
