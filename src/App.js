import { useEffect, useRef } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useToast } from '@chakra-ui/react'
import { debounce, isEmpty } from 'lodash'
import { Wifi, WifiOff } from 'react-feather'

import { ChatState } from '@context'
import { checkIsJWTExpired, removeUser } from '@utils'
import { APP_ROUTES, CHAT_LISTENERS, CHAT_EVENTS } from '@config'

import TopNavigation from '@components/TopNavigation/TopNavigation'
import { Auth, Chat, TodayPatientsList, Statistics, Calendar } from './pages'

import './App.css'

const notify = debounce(async (messageRecieved) => {
  const options = {
    tag: messageRecieved?.sender?.name,
    icon: 'https://i.ibb.co/vB1mDPv/logo192.png',
    vibrate: 3,
  }

  // mobile notification
  navigator.serviceWorker.ready.then((registration) => {
    registration.showNotification(messageRecieved.content, options)
  })

  if (Notification.permission === 'default' || Notification.permission === 'denied') {
    await Notification.requestPermission()
  }
  if (Notification.permission === 'granted') {
    // web notification
    const notification = new Notification(messageRecieved?.sender?.name, {
      body: messageRecieved.content,
      ...options,
    })
    setTimeout(notification.close.bind(notification), 4500)
  }
}, 500)

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

  if (user && user.token) {
    const isTokenExpired = checkIsJWTExpired(user.token)
    if (isTokenExpired) {
      removeUser()
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
      notify(messageRecieved)
    })
  })

  return (
    <div className="App">
      {!isEmpty(user) && <TopNavigation />}
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path={APP_ROUTES.CHATS} element={<Chat />} />
        <Route path={APP_ROUTES.TODAY_PATIENTS_LIST} element={<TodayPatientsList />} />
        <Route path={APP_ROUTES.CALENDAR} element={<Calendar />} />
        <Route path={APP_ROUTES.STATISTICS} element={<Statistics />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default App
