import _fetch from './_fetch'

const fetchUserChats = async () => await _fetch.GET(`/api/chats/user`)

const accessChat = async (userId) => await _fetch.POST(`/api/chats/access`, { userId })

const createGroupChat = async (groupChatName, selectedUsers) => {
  return await _fetch.POST('/api/chats/group', {
    name: groupChatName,
    users: JSON.stringify(selectedUsers.map((user) => user._id)),
  })
}

const leaveGroup = async (chatId, removeUser) => {
  return await _fetch.PUT('/api/chats/group/leave', {
    chatId: chatId,
    userId: removeUser._id,
  })
}

const joinGroup = async (chatId, addUser) => {
  return await _fetch.PUT('/api/chats/group/join', {
    chatId: chatId,
    userId: addUser._id,
  })
}

const removeGroup = async (chatId, groupChatName) => {
  return await _fetch.PUT('/api/chats/group/rename', {
    chatId: chatId,
    chatName: groupChatName,
  })
}

const deleteChat = async (chatId) => await _fetch.DELETE(`/api/chats/${chatId}`)

export { createGroupChat, leaveGroup, joinGroup, removeGroup, accessChat, fetchUserChats, deleteChat }
