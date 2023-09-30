const { HighriseError } = require("../handlers/error");
const { InviteSpeakerRequest, RemoveSpeakerRequest, ModerateRoomRequest, EmoteRequest, MoveUserToRoomRequest, TeleportRequest, Position, SendPayloadAndGetResponse, GetUserOutfitRequest, GetRoomPrivilegeRequest, GetBackpackRequest, ReactionRequest, TipUserRequest } = require("../models/models");
const { generateRid, CachedRoomUsers, getBotInfo, updateBotPosition } = require("../utils/Utils");

class Users {
  constructor(bot) {
    this.bot = bot;
    this.rid = generateRid();
  }

  voice = {
    add: async (user_id) => {
      try {
        if (!user_id || typeof user_id !== 'string') {
          throw new HighriseError('Invalid user_id. Please provide a valid user_id'.red);
        }

        // Create an instance of InviteSpeakerRequest
        const inviteRequest = new InviteSpeakerRequest(user_id);

        // Create the payload using the request object
        const payload = {
          _type: 'InviteSpeakerRequest',
          ...inviteRequest
        };

        // Send the invite request
        if (this.bot.ws.readyState === this.bot.websocket.OPEN) {
          this.bot.ws.send(JSON.stringify(payload), (error) => {
            if (error) {
              throw new HighriseError("Error sending InviteSpeakerRequest:".red);
            }
          });
        }

      } catch (error) {
        console.error(error);
      }
    },
    remove: async (user_id) => {
      try {
        if (!user_id || typeof user_id !== 'string') {
          throw new HighriseError('Invalid user_id. Please provide a valid user_id'.red);
        }

        // Create an instance of RemoveSpeakerRequest
        const removeRequest = new RemoveSpeakerRequest(user_id);

        // Create the payload using the request object
        const payload = {
          _type: 'RemoveSpeakerRequest',
          ...removeRequest
        };

        // Send the remove request
        if (this.bot.ws.readyState === this.bot.websocket.OPEN) {
          this.bot.ws.send(JSON.stringify(payload), (error) => {
            if (error) {
              throw new HighriseError("Error sending RemoveSpeakerRequest:".red);
            }
          });
        }

      } catch (error) {
        console.error(error);
      }
    }
  };

  async moderateRoom(request) {
    try {
      const payload = {
        _type: "ModerateRoomRequest",
        user_id: request.user_id,
        moderation_action: request.moderation_action,
        action_length: request.action_length !== undefined ? request.action_length : null,
        rid: this.rid
      };

      return new Promise((resolve, reject) => {
        if (this.bot.ws && this.bot.ws.readyState === this.bot.websocket.OPEN) {
          this.bot.ws.send(JSON.stringify(payload), error => {
            if (error) {
              console.error("Error sending ModerateRoomRequest:".red, error);
              reject(error);
              throw new HighriseError("Error sending ModerateRoomRequest:".red)
            } else {
              resolve();
            }
          });
        } else {
          reject();
        }
      });
    } catch (error) {
      console.error(error)
    }
  };

  async kick(user_id) {
    try {
      if (!user_id || typeof user_id !== 'string') {
        throw new HighriseError('Invalid user_id. Please provide a valid user_id'.red);
      }
      await this.moderateRoom(
        new ModerateRoomRequest(user_id, "kick")
      );
    } catch (error) {
      console.log(error)
    }
  };

  async ban(user_id, seconds) {
    try {
      if (!user_id || typeof user_id !== 'string') {
        throw new HighriseError('Invalid user_id. Please provide a valid user_id'.red);
      }
      if (!Number.isInteger(seconds)) {
        throw new HighriseError('Invalid duration. Duration must be an integer.'.red);
      }
      await this.moderateRoom(
        new ModerateRoomRequest(user_id, "ban", seconds)
      );
    } catch (error) {
      console.log(error)
    }
  };

  async mute(user_id, seconds) {
    try {
      if (!user_id || typeof user_id !== 'string') {
        throw new HighriseError('Invalid user_id. Please provide a valid user_id'.red);
      }
      if (!Number.isInteger(seconds)) {
        throw new HighriseError('Invalid duration. Duration must be an integer.'.red);
      }
      await this.moderateRoom(
        new ModerateRoomRequest(user_id, "mute", seconds)
      );
    } catch (error) {
      console.log(error)
    }
  };

  async unmute(user_id) {
    try {
      if (!user_id || typeof user_id !== 'string') {
        throw new HighriseError('Invalid user_id. Please provide a valid user_id'.red);
      }
      await this.moderateRoom(
        new ModerateRoomRequest(user_id, "mute", 1)
      );
    } catch (error) {
      console.log(error)
    }
  };

  async unban(user_id) {
    try {
      if (!user_id || typeof user_id !== 'string') {
        throw new HighriseError('Invalid user_id. Please provide a valid user_id'.red);
      }
      await this.moderateRoom(
        new ModerateRoomRequest(user_id, "unban", null)
      );
    } catch (error) {
      console.log(error)
    }
  };

  async emote(user_id, emote_id) {
    try {
      if (!emote_id || typeof emote_id !== 'string') {
        throw new HighriseError('Invalid emote ID. Please provide a valid string for emote ID.');
      }

      if (!user_id || typeof user_id !== 'string') {
        throw new HighriseError('Invalid user_id. Please provide a valid user_id'.red);
      }

      const emoteRequest = new EmoteRequest(user_id, emote_id, this.rid);

      const payload = {
        _type: 'EmoteRequest',
        emote_id: emoteRequest.emote_id,
        target_user_id: emoteRequest.target_user_id,
        rid: emoteRequest.rid
      };

      if (this.bot.ws && this.bot.ws.readyState === this.bot.websocket.OPEN) {
        this.bot.ws.send(JSON.stringify(payload), (error) => {
          if (error) {
            console.error("Error sending EmoteRequest:".red, error);
            throw new HighriseError("Error sending EmoteRequest:".red)
          }
        });
      }
    } catch (error) {
      console.error(error); // Log the error message
    }
  };

  async react(user_id, reaction) {
    try {
      if (!reaction || typeof reaction !== 'string') {
        throw new HighriseError('Invalid Reaction. Please provide a valid string for reaction.');
      }

      if (!user_id || typeof user_id !== 'string') {
        throw new HighriseError('Invalid user_id. Please provide a valid user_id'.red);
      }

      const availableReactions = ['clap', 'heart', 'thumbs', 'wave', 'wink'];
      if (reaction && !availableReactions.includes(reaction)) {
        return console.error(`Invalid reaction '${reaction}'`.red + `\n` + `Available Reactions:`.green + `\n` + `${availableReactions.join("\n")}`);
      }
      const reactionRequest = new ReactionRequest(user_id, reaction, this.rid);

      const payload = {
        _type: 'ReactionRequest',
        reaction: reactionRequest.reaction,
        target_user_id: reactionRequest.target_user_id,
        rid: reactionRequest.rid
      };

      if (this.bot.ws.readyState === this.bot.websocket.OPEN) {
        this.bot.ws.send(JSON.stringify(payload), (error) => {
          if (error) {
            throw new HighriseError("Error sending EmoteRequest:".red)
          }
        });
      }
    } catch (error) {
      console.error(error); // Log the error message
    }
  };

  async tip(user_id, amount) {
    try {

      const BARS = {
        1: 'gold_bar_1',
        5: 'gold_bar_5',
        10: 'gold_bar_10',
        50: 'gold_bar_50',
        100: 'gold_bar_100',
        500: 'gold_bar_500',
        1000: 'gold_bar_1k',
        5000: 'gold_bar_5000',
        10000: 'gold_bar_10k'
      }


      if (!user_id || typeof user_id !== 'string') {
        throw new HighriseError('Invalid user_id. Please provide a valid user_id'.red);
      }

      if (typeof amount !== 'number' || !BARS.hasOwnProperty(amount)) {
        const availableAmounts = Object.keys(BARS).join(', ');
        throw new HighriseError(`Invalid amount. Please provide a valid amount from the available gold bars: ${availableAmounts}`.red);
      }

      if (this.bot.ws && this.bot.ws.readyState === this.bot.websocket.OPEN) {
        const tipUserRequest = new TipUserRequest(user_id, BARS[amount], this.rid);
        const payload = {
          _type: 'TipUserRequest',
          user_id: tipUserRequest.user_id,
          gold_bar: tipUserRequest.gold_bar,
          rid: tipUserRequest.rid
        }

        const sender = new SendPayloadAndGetResponse(this.bot);

        const response = await sender.sendPayloadAndGetResponse(
          payload,
          TipUserRequest.Response
        );

        return response.result.result
      }

    } catch (error) {
      console.error(error); // Log the error message
    }
  }

  transport(user_id, room_id) {
    try {
      if (!user_id || user_id === undefined || user_id === null) {
        throw new HighriseError('Invalid user_id. Please provide a valid user_id'.red);
      }
      if (!room_id || typeof room_id !== 'string') {
        throw new HighriseError(`Invalid room ID. Please provide a valid value for room ID.`.red);
      }

      const transportRequest = new MoveUserToRoomRequest(user_id, room_id, this.rid);
      const request = {
        _type: 'MoveUserToRoomRequest',
        user_id: transportRequest.user_id,
        room_id: transportRequest.room_id,
        rid: transportRequest.rid
      };

      if (this.bot.ws && this.bot.ws.readyState === this.bot.websocket.OPEN) {
        this.bot.ws.send(JSON.stringify(request), (error) => {
          if (error) {
            console.error('Error sending transport request:'.red, error);
            throw new HighriseError("Error sending TransportRequest:".red);
          }
        });
      }
    } catch (error) {
      console.error(error)
    }
  };

  async teleport(user_id, x, y, z, facing = 'FrontRight') {
    try {
      const validFacing = ['BackLeft', 'BackRight', 'FrontLeft', 'FrontRight'];

      if (!user_id || user_id === undefined || user_id === null) {
        throw new HighriseError('Invalid user_id. Please provide a valid user_id'.red);
      }

      if (x === undefined || x === null || y === undefined || y === null || z === undefined || z === null) {
        throw new HighriseError('Invalid coordinates. Please provide valid values for x, y, and z.'.red);
      }

      if (typeof facing !== 'string') {
        throw new HighriseError('Invalid facing parameter. It must be a string.'.red);
      }

      if (!validFacing.includes(facing)) {
        throw new HighriseError(`Invalid facing parameter (${facing})`.red + `\n` + 'Available Facing Options:'.green + '\n' + `${validFacing.join("\n")}`);
      }

      const dest = new Position(x, y, z, facing);

      const teleportRequest = new TeleportRequest(user_id, dest, this.rid);
      const request = {
        _type: 'TeleportRequest',
        user_id: teleportRequest.user_id,
        destination: teleportRequest.destination,
        rid: teleportRequest.rid
      };

      if (this.bot.ws && this.bot.ws.readyState === this.bot.websocket.OPEN) {
        this.bot.ws.send(JSON.stringify(request), (error) => {
          const userData = CachedRoomUsers.get(request.user_id);
          if (userData) {
            userData.position = request.destination;
          }
          const botInfo = getBotInfo();
          if (botInfo.id === user_id) {
            const bot_position = {
              x: dest.x,
              y: dest.y,
              z: dest.z,
              facing: dest.facing
            }
            updateBotPosition(bot_position);
          }
          if (error) {
            console.error('Error sending teleport request:'.red, error);
            throw new HighriseError("Error sending TeleportRequest:".red);
          }
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  permissions = {
    get: async (user_id) => {
      try {

        if (!user_id || typeof user_id !== 'string') {
          throw new HighriseError('Invalid user_id. Please provide a valid user_id'.red);
        }
        if (this.bot.ws && this.bot.ws.readyState === this.bot.websocket.OPEN) {
          const getRoomPrivilegeRequest = new GetRoomPrivilegeRequest(user_id, this.rid);
          const payload = {
            _type: "GetRoomPrivilegeRequest",
            user_id: getRoomPrivilegeRequest.user_id,
            rid: getRoomPrivilegeRequest.rid
          };

          const sender = new SendPayloadAndGetResponse(this.bot); // Create an instance of SendPayloadAndGetResponse
          const response = await sender.sendPayloadAndGetResponse(
            payload,
            GetRoomPrivilegeRequest.Response
          );

          return response.content.content;
        }
      } catch (error) {
        throw new HighriseError("Error fetching users permissions:", error);
      }
    },

    moderator: {
      add: async (user_id) => {
        if (!user_id || typeof user_id !== 'string') {
          throw new HighriseError('Invalid user_id. Please provide a valid user_id'.red);
        }
        const permissions = { moderator: true };
        await this.change(user_id, permissions);
      },
      remove: async (user_id) => {
        if (!user_id || typeof user_id !== 'string') {
          throw new HighriseError('Invalid user_id. Please provide a valid user_id'.red);
        }
        const permissions = { moderator: false };
        await this.change(user_id, permissions);
      }
    },

    designer: {
      add: async (user_id) => {
        if (!user_id || typeof user_id !== 'string') {
          throw new HighriseError('Invalid user_id. Please provide a valid user_id'.red);
        }
        const permissions = { designer: true };
        await this.change(user_id, permissions);
      },
      remove: async (user_id) => {
        if (!user_id || typeof user_id !== 'string') {
          throw new HighriseError('Invalid user_id. Please provide a valid user_id'.red);
        }
        const permissions = { designer: false };
        await this.change(user_id, permissions);
      }
    }
  }

  async change(user_id, permissions) {
    try {
      const payload = {
        _type: 'ChangeRoomPrivilegeRequest',
        user_id: user_id,
        permissions: permissions,
        rid: this.rid
      };

      if (this.bot.ws.readyState === this.bot.websocket.OPEN) {
        this.bot.ws.send(JSON.stringify(payload), (error) => {
          if (error) {
            throw new HighriseError("Error sending ChangeRoomPrivilegeRequest:".red);
          }
        });
      };
    } catch (error) {
      console.error(error);
    }
  };

  backpack = {
    get: async (user_id) => {
      try {

        if (!user_id || user_id === undefined || user_id === null) {
          throw new HighriseError('Invalid user_id. Please provide a valid user_id'.red);
        }

        if (this.bot.ws && this.bot.ws.readyState === this.bot.websocket.OPEN) {
          const getBackpackRequest = new GetBackpackRequest(user_id, this.rid);
          const payload = {
            _type: "GetBackpackRequest",
            user_id: getBackpackRequest.user_id,
            rid: getBackpackRequest.rid
          };

          const sender = new SendPayloadAndGetResponse(this.bot); // Create an instance of SendPayloadAndGetResponse
          const response = await sender.sendPayloadAndGetResponse(
            payload,
            GetBackpackRequest.Response
          );

          return response.backpack.backpack;
        }

      } catch (error) {
        throw new HighriseError("Error fetching users backpack:", error);
      }
    }
  }
  outfit = {
    get: async (user_id) => {
      try {

        if (!user_id || typeof user_id !== 'string') {
          throw new HighriseError('Invalid user_id. Please provide a valid user_id'.red);
        }

        if (this.bot.ws && this.bot.ws.readyState === this.bot.websocket.OPEN) {
          const getUserOutfitRequest = new GetUserOutfitRequest(user_id, this.rid);
          const payload = {
            _type: "GetUserOutfitRequest",
            user_id: getUserOutfitRequest.user_id,
            rid: getUserOutfitRequest.rid
          };

          const sender = new SendPayloadAndGetResponse(this.bot); // Create an instance of SendPayloadAndGetResponse
          const response = await sender.sendPayloadAndGetResponse(
            payload,
            GetUserOutfitRequest.Response
          );

          return response.outfit.outfit

        }
      } catch (error) {
        throw new HighriseError("Error fetching users outfit:", error);
      }
    }
  }
};

module.exports = { Users };