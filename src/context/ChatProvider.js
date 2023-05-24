import { createContext, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@chakra-ui/react'
import io from 'socket.io-client'

import { ENDPOINT, CHAT_EVENTS, CHAT_LISTENERS } from '../config'

import ClearAnnounceSound from '../assets/songs/clear-announce.wav'

const ChatContext = createContext()
let socket, selectedChatCompare

export const ChatProvider = ({ children }) => {
  const [user, setUser] = useState() // If 'userInfo' is available, else set '{}'
  const [selectedChat, setSelectedChat] = useState()
  const [selectedChatAppointmentModal, setSelectedChatAppointmentModal] = useState({})
  const [chats, setChats] = useState([])
  const [notifications, setNotifications] = useState([])
  const [messages, setMessages] = useState([])
  const [fetchAgain, setFetchAgain] = useState(false)
  const [isLoadingMessages, setIsLoadingMessages] = useState(false)

  const toast = useToast()
  const navigate = useNavigate()

  const fetchMessages = async () => {
    if (!selectedChat) return
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
        duration: 5000,
        isClosable: true,
        position: 'bottom-right',
        variant: 'solid',
      })
    }
    setIsLoadingMessages(false)
  }

  useEffect(() => {
    if (socket === undefined) {
      socket = io(ENDPOINT)
    }
  }, [])

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'))
    setUser(userInfo)

    if (!userInfo) {
      navigate('/')
    }

    return () => {
      selectedChatCompare = undefined
    }
  }, [navigate])

  useEffect(() => {
    fetchMessages() // Whenever users switches chat, call the function again
    selectedChatCompare = selectedChat
    // eslint-disable-next-line
  }, [selectedChat])

  useEffect(() => {
    socket.on(CHAT_LISTENERS.MESSAGE_RECIEVED, (messageRecieved) => {
      if (!selectedChatCompare || selectedChatCompare._id !== messageRecieved.chat[0]._id) {
        const { name: senderName } = messageRecieved.sender
        const { chatName } = messageRecieved.chat?.[0]
        const notificationSender = chatName === 'sender' ? senderName : chatName
        const isSenderNotificationFound = Boolean(
          notifications.find((notif) => notif.notificationSender === notificationSender),
        )

        new Audio(ClearAnnounceSound).play()
        if (!isSenderNotificationFound) {
          const newNotification = { ...messageRecieved, notificationSender }
          setNotifications([newNotification, ...notifications])
          setFetchAgain(!fetchAgain) // fetch all the chats again
        }
      } else {
        setMessages([...messages, messageRecieved])
      }
    })
  })

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
      }}>
      {children}
    </ChatContext.Provider>
  )
}

export const ChatState = () => useContext(ChatContext)
