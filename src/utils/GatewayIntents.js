const GatewayIntentBits = {
  Ready: 1 << 1,
  Messages: 1 << 2,
  DirectMessages: 1 << 3,
  Joins: 1 << 4,
  Leaves: 1 << 5,
  Reactions: 1 << 6,
  Emotes: 1 << 7,
  Tips: 1 << 8,
  VoiceChat: 1 << 9,
  Movements: 1 << 10,
  Error: 1 << 11,
};

const EventTypeIntents = {
  SessionMetadata: [GatewayIntentBits.Ready],
  ChatEvent: [GatewayIntentBits.Messages],
  MessageEvent: [GatewayIntentBits.DirectMessages],
  UserJoinedEvent: [GatewayIntentBits.Joins],
  UserLeftEvent: [GatewayIntentBits.Leaves],
  ReactionEvent: [GatewayIntentBits.Reactions],
  EmoteEvent: [GatewayIntentBits.Emotes],
  TipReactionEvent: [GatewayIntentBits.Tips],
  VoiceEvent: [GatewayIntentBits.VoiceChat],
  UserMovedEvent: [GatewayIntentBits.Movements],
  Error: [GatewayIntentBits.Error]
};

module.exports = {
  GatewayIntentBits,
  EventTypeIntents,
};
