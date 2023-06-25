import { createContext, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@chakra-ui/react'
import { isEmpty } from 'lodash'

import { getUser } from '@utils'
import { CHAT_EVENTS } from '@config'
import { fetchMessagesByChatId } from '@services/messages'

const ChatContext = createContext()

export const ChatProvider = ({ children, socket }) => {
  const navigate = useNavigate()
  const [user, setUser] = useState() // If 'userInfo' is available, else set '{}'
  const [selectedChat, setSelectedChat] = useState()
  const [selectedChatAppointmentModal, setSelectedChatAppointmentModal] = useState({})
  const [chats, setChats] = useState([])
  const [notifications, setNotifications] = useState([])
  const [messages, setMessages] = useState([])
  const [fetchAgain, setFetchAgain] = useState(false)
  const [isLoadingMessages, setIsLoadingMessages] = useState(false)
  const [selectedChatCompare, setSelectedChatCompare] = useState()
  const [socketConnected, setSocketConnected] = useState(false)

  const toast = useToast()

  const fetchMessages = async () => {
    if (!selectedChat || !user) return
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
    const userInfo = getUser()
    if (isEmpty(userInfo)) navigate('/')

    setUser(userInfo)
    fetchMessages()

    return () => {
      setSelectedChatCompare(undefined)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate])

  // Whenever users switches chat, call the function again
  useEffect(() => {
    fetchMessages()
    setSelectedChatCompare(selectedChat)
    // eslint-disable-next-line
  }, [selectedChat])

  return (
    <ChatContext.Provider
      value={{
        user,
        socket,
        setUser,
        selectedChat,
        setSelectedChat,
        selectedChatAppointmentModal,
        setSelectedChatAppointmentModal,
        chats,
        setChats,
        notifications,
        setNotifications,
        messages,
        setMessages,
        fetchMessages,
        isLoadingMessages,
        setIsLoadingMessages,
        fetchAgain,
        setFetchAgain,
        selectedChatCompare,
        setSelectedChatCompare,
        socketConnected,
        setSocketConnected,
      }}>
      {children}
    </ChatContext.Provider>
  )
}

export const ChatState = () => useContext(ChatContext)
