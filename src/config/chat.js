export const CHAT_EVENTS = {
  SETUP: 'setup',
  JOIN_CHAT: 'join chat',
  TYPING: 'typing',
  STOP_TYPING: 'stop typing',
  NEW_MESSAGE: 'new message',
  UPDATE_GROUP: 'update group',
  DELETE_CHAT: 'delete chat',
}

export const CHAT_LISTENERS = {
  CONNECTED: 'connected',
  CHAT_ERROR: 'chat error',
  TYPING: 'typing',
  TYPING_STOPPED: 'typing stopped',
  MESSAGE_RECIEVED: 'message recieved',
  GROUP_UPDATED: 'group updated',
  CHAT_DELETED: 'chat deleted',
}
