import { createContext, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@chakra-ui/react'

import { CHAT_EVENTS } from '../config'

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
      const response = await fetch(`/api/message/${selectedChat._id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      if (response.status === 200) {
        setMessages(await response.json())
        socket.emit(CHAT_EVENTS.JOIN_CHAT, selectedChat._id)
      }
    } catch (error) {
      toast({
        title: 'Error Occured!',
        description: 'Failed to Load the Messages',
        status: 'error',
        position: 'bottom-right',
      })
    }
    setIsLoadingMessages(false)
  }

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'))
    if (!userInfo) navigate('/')

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
