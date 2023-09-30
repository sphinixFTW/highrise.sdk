const { HighriseError } = require("../handlers/error");
const { FloorHitRequest, Position, AnchorHitRequest, AnchorPosition } = require("../models/models");
const { generateRid, updateBotPosition } = require("../utils/Utils");

class Move {
  constructor(bot) {
    this.bot = bot;
    this.rid = generateRid();
  }

  walk(x, y, z, facing = 'FrontLeft') {
    try {

      const validFacing = ['BackLeft', 'BackRight', 'FrontLeft', 'FrontRight'];

      if (x === undefined || x === null || y === undefined || y === null || z === undefined || z === null) {
        throw new HighriseError('Invalid coordinates. Please provide valid values for x, y, and z.'.red)
      }

      if (typeof facing !== 'string') {
        throw new HighriseError('Invalid facing parameter. It must be a string.'.red);
      }

      if (!validFacing.includes(facing)) {
        throw new HighriseError(`Invalid facing parameter (${facing})`.red + `\n` + 'Available Facing Options:'.green + '\n' + `${validFacing.join("\n")}`);
      }

      const dest = new Position(x, y, z, facing);
      const floorHitRequest = new FloorHitRequest(dest);

      const payload = {
        _type: 'FloorHitRequest',
        destination: floorHitRequest.destination,
        rid: floorHitRequest.rid
      };

      if (this.bot.ws && this.bot.ws.readyState === this.bot.websocket.OPEN) {
        this.bot.ws.send(JSON.stringify(payload), (error) => {
          if (error) {
            throw new HighriseError("Error sending FloorHitRequest:".red);
          } else {
            const bot_position = {
              x: dest.x,
              y: dest.y,
              z: dest.z,
              facing: dest.facing
            }
            updateBotPosition(bot_position);
          }
        });
      }
    } catch (error) {
      console.error(error);
    }
  }

  sit(entity_id, anchor_ix = 0) {
    try {
      const entityIDString = String(entity_id);
      const anchorIndex = parseInt(anchor_ix, 10);

      if (!entityIDString || isNaN(anchorIndex)) {
        throw new Error('Invalid entity ID or anchor index. Please provide valid values for entity_id and anchor_ix.'.red);
      }

      const dest = new AnchorPosition(entityIDString, anchorIndex);
      const anchorHitRequest = new AnchorHitRequest(dest);

      const payload = {
        _type: 'AnchorHitRequest',
        anchor: anchorHitRequest.anchor,
        rid: anchorHitRequest.rid
      };

      if (this.bot.ws && this.bot.ws.readyState === this.bot.websocket.OPEN) {
        this.bot.ws.send(JSON.stringify(payload), (error) => {
          if (error) {
            throw new HighriseError("Error sending AnchorHitRequest:".red);
          } else {
            const bot_position = {
              entity_id: dest.entity_id,
              anchor_ix: dest.anchor_ix
            }
            updateBotPosition(bot_position);
          }
        });
      }
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = { Move };