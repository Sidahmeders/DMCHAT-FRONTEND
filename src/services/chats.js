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

const leaveGroup = async (selectedChat, removeUser) => {
  const response = await fetch('/api/chat/groups/leave', {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${user.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      chatId: selectedChat._id,
      userId: removeUser._id,
    }),
  })

  return await response.json()
}

const joinGroup = async (selectedChat, addUser) => {
  const response = await fetch('/api/chat/groups/join', {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${user.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      chatId: selectedChat._id,
      userId: addUser._id,
    }),
  })

  return await response.json()
}

const removeGroup = async (selectedChat, groupChatName) => {
  const response = await fetch('/api/chat/groups/rename', {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${user.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      chatId: selectedChat._id,
      chatName: groupChatName,
    }),
  })

  return await response.json()
}

export { createGroupChat, leaveGroup, joinGroup, removeGroup }
