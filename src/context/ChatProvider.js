import { createContext, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@chakra-ui/react'
import { debounce } from 'lodash'

import { notify } from '@utils'
import { CHAT_LISTENERS, CHAT_EVENTS } from '@config'
import { fetchMessagesByChatId } from '@services/messages'

const ChatContext = createContext()

const updateChatMessages = debounce(
  ({ selectedChat, targetChat, createdMessage, setMessages, notifications, setNotifications, setFetchAgain }) => {
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
        setFetchAgain((prevState) => !prevState)
      }
    }
  },
)

export const ChatProvider = ({ children, socket }) => {
  const toast = useToast()
  const navigate = useNavigate()

  const [selectedChat, setSelectedChat] = useState({})
  const [userChats, setUserChats] = useState([])
  const [notifications, setNotifications] = useState([])
  const [messages, setMessages] = useState([])
  const [fetchAgain, setFetchAgain] = useState(false)
  const [isLoadingMessages, setIsLoadingMessages] = useState(false)
  const [socketConnected, setSocketConnected] = useState(false)

  const fetchMessages = async () => {
    if (!selectedChat._id) return
    setIsLoadingMessages(true)
    try {
      const messagesData = await fetchMessagesByChatId(selectedChat._id)
      setMessages(messagesData)
      socket.emit(CHAT_EVENTS.JOIN_CHAT, selectedChat._id)
    } catch (error) {
      toast({ description: 'Impossible de charger les messages' })
    }
    setIsLoadingMessages(false)
  }

  useEffect(() => {
    fetchMessages()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate])

  // Whenever users switches chat, call the function again
  useEffect(() => {
    fetchMessages()
    // eslint-disable-next-line
  }, [selectedChat])

  useEffect(() => {
    socket.on(CHAT_LISTENERS.MESSAGE_RECIEVED, (payload) => {
      try {
        const { createdMessage, targetChat } = payload
        updateChatMessages({
          selectedChat,
          targetChat,
          createdMessage,
          setMessages,
          notifications,
          setNotifications,
          setFetchAgain,
        })
        const { sender, content } = createdMessage || {}
        notify({ title: sender?.name, description: content })
      } catch (error) {
        toast({ description: error.message })
      }
    })
  })

  useEffect(() => {
    socket.on(CHAT_LISTENERS.CHAT_ERROR, (errorMessage) => {
      toast({ title: 'Socket.IO Chat Error, veuillez réessayer plus tard', description: errorMessage })
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
        fetchMessages,
        isLoadingMessages,
        fetchAgain,
        setFetchAgain,
        socketConnected,
        setSocketConnected,
      }}>
      {children}
    </ChatContext.Provider>
  )
}

export const ChatState = () => useContext(ChatContext)
