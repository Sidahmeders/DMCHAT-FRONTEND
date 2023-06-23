import { getUser } from '@utils'

const user = getUser()

const createGroupChat = async (groupChatName, selectedUsers) => {
  const response = await fetch('/api/chat/groups', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${user.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: groupChatName,
      users: JSON.stringify(selectedUsers.map((user) => user._id)),
    }),
  })

  return await response.json()
}

const leaveGroup = async (chatId, removeUser) => {
  const response = await fetch('/api/chat/groups/leave', {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${user.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      chatId: chatId,
      userId: removeUser._id,
    }),
  })

  return await response.json()
}

const joinGroup = async (chatId, addUser) => {
  const response = await fetch('/api/chat/groups/join', {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${user.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      chatId: chatId,
      userId: addUser._id,
    }),
  })

  return await response.json()
}

const removeGroup = async (chatId, groupChatName) => {
  const response = await fetch('/api/chat/groups/rename', {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${user.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      chatId: chatId,
      chatName: groupChatName,
    }),
  })

  return await response.json()
}

const accessChat = async (userId) => {
  const response = await fetch(`/api/chat/access`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${user.token}`,
    },
    body: JSON.stringify({ userId }),
  })

  return await response.json()
}

export { createGroupChat, leaveGroup, joinGroup, removeGroup, accessChat }
