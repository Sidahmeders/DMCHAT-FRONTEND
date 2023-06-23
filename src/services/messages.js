import { getUser } from '@utils'

const user = getUser()

const createMessage = async (newMessage, chatId) => {
  const response = await fetch('/api/messages', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${user.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      content: newMessage,
      chatId: chatId,
    }),
  })

  return await response.json()
}

const deleteMessages = async (chatId) => {
  const response = await fetch(`/api/messages/${chatId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  })

  return response.status
}

export { createMessage, deleteMessages }
