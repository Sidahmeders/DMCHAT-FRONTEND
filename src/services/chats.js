import Fetch from './_fetch'

const _fetch = new Fetch()

const fetchUserChats = async () => await _fetch.GET(`/api/chat`)

const accessChat = async (userId) => await _fetch.POST(`/api/chat/access`, { userId })

const createGroupChat = async (groupChatName, selectedUsers) => {
  return await _fetch.POST('/api/chat/groups', {
    name: groupChatName,
    users: JSON.stringify(selectedUsers.map((user) => user._id)),
  })
}

const leaveGroup = async (chatId, removeUser) => {
  return await _fetch.PUT('/api/chat/groups/leave', {
    chatId: chatId,
    userId: removeUser._id,
  })
}

const joinGroup = async (chatId, addUser) => {
  return await _fetch.PUT('/api/chat/groups/join', {
    chatId: chatId,
    userId: addUser._id,
  })
}

const removeGroup = async (chatId, groupChatName) => {
  return await _fetch.PUT('/api/chat/groups/rename', {
    chatId: chatId,
    chatName: groupChatName,
  })
}

export { createGroupChat, leaveGroup, joinGroup, removeGroup, accessChat, fetchUserChats }
