import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import addNotification, { Notifications } from './_notif/index'
import { debounce } from 'lodash'

import { ChatState } from './context'
import { checkIsJWTExpired } from './utils'
import { APP_ROUTES, CHAT_LISTENERS, CHAT_EVENTS } from './config'

import { Home, Chat, TodayPatientsList, Statistics, Calendar } from './pages'
import TopNavigation from './components/TopNavigation/TopNavigation'

import './App.css'

const notify = debounce((messageRecieved) => {
  addNotification({
    title: messageRecieved?.sender?.name,
    message: messageRecieved.content,
    tag: messageRecieved?.sender?.name,
    icon: 'https://i.ibb.co/vB1mDPv/logo192.png',
    vibrate: 3,
    native: true,
  })
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

  if (user && user.token) {
    const isTokenExpired = checkIsJWTExpired(user.token)
    if (isTokenExpired) {
      localStorage.removeItem('userInfo')
    }
  }

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
      {user && <TopNavigation />}
      <Notifications />
      <Routes>
        <Route path="/" element={<Home />} />
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
