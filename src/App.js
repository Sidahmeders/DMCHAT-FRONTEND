import { useEffect, useRef } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { useToast } from '@chakra-ui/react'
import { isEmpty } from 'lodash'
import { Wifi, WifiOff } from 'react-feather'

import { ChatState } from '@context'
import { checkIsJWTExpired, removeUser, notify, getPageRoute } from '@utils'
import { APP_ROUTES, CHAT_LISTENERS, CHAT_EVENTS } from '@config'

import TopNavigation from '@components/TopNavigation/TopNavigation'
import { Auth, Chat, TodayPatientsList, Statistics, Calendar } from './pages'

import './App.css'

const App = () => {
  const {
    user,
    socket,
    selectedChatCompare,
    fetchAgain,
    setFetchAgain,
    messages,
    setMessages,
    notifications,
    setNotifications,
    setSocketConnected,
  } = ChatState()
  const toast = useToast()
  const navigation = useNavigate()

  if (user && user.token) {
    if (checkIsJWTExpired(user.token)) {
      removeUser()
      navigation('/')
    }
  }

  const toastIdRef = useRef()

  const updateToast = () => {
    if (toastIdRef.current) {
      toast.update(toastIdRef.current, {
        title: 'tu es de retour en ligne',
        status: 'success',
        icon: <Wifi />,
        position: 'bottom',
        isClosable: false,
        variant: 'solid',
      })
    }
  }

  const addToast = () => {
    toastIdRef.current = toast({
      title: 'tu es hors ligne!',
      description: "S'il vous plait, vérifiez votre connexion internet",
      status: 'error',
      duration: 1000 * 60 * 60,
      icon: <WifiOff />,
      position: 'bottom',
      isClosable: false,
      variant: 'solid',
    })
  }

  useEffect(() => {
    const handleOnlineStatus = () => updateToast()
    const handleOfflineStatus = () => addToast()

    window.ononline = handleOnlineStatus
    window.onoffline = handleOfflineStatus
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!user) return
    socket.emit(CHAT_EVENTS.SETUP, user)
    socket.on(CHAT_LISTENERS.CONNECTED, () => setSocketConnected(true))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, socket])

  useEffect(() => {
    socket.on(CHAT_LISTENERS.MESSAGE_RECIEVED, (messageRecieved) => {
      if (!selectedChatCompare || selectedChatCompare._id !== messageRecieved.chat[0]._id) {
        const { name: senderName } = messageRecieved.sender
        const { chatName } = messageRecieved.chat?.[0]
        const notificationSender = chatName === 'sender' ? senderName : chatName
        const isSenderNotificationFound = Boolean(
          notifications.find((notif) => notif.notificationSender === notificationSender),
        )
        if (!isSenderNotificationFound) {
          const newNotification = { ...messageRecieved, notificationSender }
          setNotifications([newNotification, ...notifications])
          setFetchAgain(!fetchAgain) // fetch all the chats again
        }
      } else {
        setMessages([...messages, messageRecieved])
      }
      const { sender, content } = messageRecieved || {}
      notify({ title: sender?.name, description: content })
    })
  })

  return (
    <div className="App">
      {!isEmpty(user) && <TopNavigation />}
      <Routes>
        {isEmpty(user) && <Route path="/" element={<Auth />} />}
        <Route path={APP_ROUTES.CHATS} element={<Chat />} />
        <Route path={APP_ROUTES.TODAY_PATIENTS_LIST} element={<TodayPatientsList />} />
        <Route path={APP_ROUTES.CALENDAR} element={<Calendar />} />
        <Route path={APP_ROUTES.STATISTICS} element={<Statistics />} />
        <Route path="*" element={<Navigate to={getPageRoute()} replace />} />
      </Routes>
    </div>
  )
}

export default App
