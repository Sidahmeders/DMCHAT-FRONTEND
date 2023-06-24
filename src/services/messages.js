import Fetch from './_fetch'

const _fetch = new Fetch()

const createMessage = async (newMessage, chatId) => {
  return await _fetch.POST('/api/messages', {
    content: newMessage,
    chatId: chatId,
  })
}

const deleteMessages = async (chatId) => await _fetch.DELETE(`/api/messages/${chatId}`)

export { createMessage, deleteMessages }
