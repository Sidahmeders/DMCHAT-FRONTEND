import { createContext, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@chakra-ui/react'
import { debounce } from 'lodash'

import { getUser, notify } from '@utils'
import { CHAT_EVENT_LISTENERS } from '@config'
import { fetchMessagesByChatId } from '@services/messages'

const ChatContext = createContext()

const updateChatMessages = debounce(
  ({ selectedChat, targetChat, createdMessage, setMessages, notifications, setNotifications, setFetchChatsAgain }) => {
    if (selectedChat._id === targetChat._id) {
      setMessages((prevMessages) => [...prevMessages, createdMessage])
    }

    if (selectedChat._id !== targetChat._id) {
      const { name: senderName } = createdMessage.sender
      const { chatName } = createdMessage.chat?.[0]
      const notificationSender = chatName === 'sender' ? senderName : chatName
      const isSenderNotificationFound = notifications.find((notif) => notif.notificationSender === notificationSender)

      if (!isSenderNotificationFound) {
        const newNotification = { ...createdMessage, notificationSender }
        setNotifications([newNotification, ...notifications])
        setFetchChatsAgain((prevState) => !prevState)
      }
    }
  },
)

export const ChatProvider = ({ children, socket }) => {
  const toast = useToast()
  const navigate = useNavigate()

  const [userChats, setUserChats] = useState([])
  const [selectedChat, setSelectedChat] = useState({})
  const [notifications, setNotifications] = useState([])
  const [messages, setMessages] = useState([])
  const [usersList, setUsersList] = useState([])
  const [groupChatsList, setGroupChatsList] = useState([])
  const [isLoadingMessages, setIsLoadingMessages] = useState(false)
  const [socketConnected, setSocketConnected] = useState(false)
  const [fetchChatsAgain, setFetchChatsAgain] = useState(false)

  const fetchMessages = async () => {
    if (!selectedChat._id) return
    setIsLoadingMessages(true)
    try {
      const messagesData = await fetchMessagesByChatId(selectedChat._id)
      setMessages(messagesData)
      socket.emit(CHAT_EVENT_LISTENERS.JOIN_CHAT, selectedChat._id)
    } catch (error) {
      toast({ description: 'Impossible de charger les messages' })
    }
    setIsLoadingMessages(false)
  }

  useEffect(() => {
    fetchMessages()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate, selectedChat])

  useEffect(() => {
    socket.on(CHAT_EVENT_LISTENERS.NEW_MESSAGE, (payload) => {
      try {
        const { createdMessage, targetChat } = payload
        updateChatMessages({
          selectedChat,
          targetChat,
          createdMessage,
          setMessages,
          notifications,
          setNotifications,
          setFetchChatsAgain,
        })
        const { sender, content } = createdMessage || {}
        notify({ title: sender?.name, description: content })
      } catch (error) {
        toast({ description: error.message })
      }
    })
  })

  useEffect(() => {
    socket.on(CHAT_EVENT_LISTENERS.CHAT_ERROR, (errorMessage) => {
      toast({ title: 'Socket.IO Chat Error, veuillez réessayer plus tard', description: errorMessage })
    })

    socket.on(CHAT_EVENT_LISTENERS.UPDATE_GROUP, (chatPayload) => {
      if (chatPayload.groupAdmin._id === getUser()._id) {
        setSelectedChat(chatPayload)
      }
      setFetchChatsAgain((prevState) => !prevState)
    })

    socket.on(CHAT_EVENT_LISTENERS.DELETE_CHAT, (chatPayload) => {
      setGroupChatsList((prevList) => prevList.filter((chat) => chat._id !== chatPayload._id))
      setUserChats((prevList) =>
        prevList.map((chat) => (chat._id === chatPayload._id ? null : chat)).filter((chat) => chat),
      )
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <ChatContext.Provider
      value={{
        socket,
        selectedChat,
        setSelectedChat,
        userChats,
        setUserChats,
        notifications,
        setNotifications,
        messages,
        setMessages,
        usersList,
        setUsersList,
        groupChatsList,
        setGroupChatsList,
        fetchMessages,
        isLoadingMessages,
        fetchChatsAgain,
        setFetchChatsAgain,
        socketConnected,
        setSocketConnected,
      }}>
      {children}
    </ChatContext.Provider>
  )
}

export const ChatState = () => useContext(ChatContext)
