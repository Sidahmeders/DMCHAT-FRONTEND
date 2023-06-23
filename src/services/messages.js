import { getUser } from '@utils'

const user = getUser()

const deleteMessages = async (chatId) => {
  const response = await fetch(`/api/messages/${chatId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  })

  return response.status
}

export { deleteMessages }
