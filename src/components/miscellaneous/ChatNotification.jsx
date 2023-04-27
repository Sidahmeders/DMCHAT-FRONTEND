import { useNavigate } from 'react-router-dom'
import { Menu, MenuButton, MenuItem, MenuList, Text } from '@chakra-ui/react'
import { BellIcon } from '@chakra-ui/icons'

import { ChatState } from '../../context'
import { getSender } from '../../utils'
import { APP_ROUTES } from '../../config'

const ChatNotification = () => {
  const { user, setSelectedChat, notification, setNotification } = ChatState()
  const navigate = useNavigate()

  return (
    <Menu>
      <MenuButton p="1" className="notification-badge-container">
        <BellIcon fontSize="2xl" m="1" />

        {notification.length > 0 && (
          <span className="notification-badge">{notification.length > 9 ? '9+' : notification.length}</span>
        )}
      </MenuButton>

      <MenuList p="2">
        {!notification.length && <Text pl="2">pas de nouveaux message</Text>}
        {notification.map((notif) => (
          <MenuItem
            key={notif._id}
            onClick={() => {
              navigate(APP_ROUTES.CHATS)
              setSelectedChat(notif.chat[0])
              setNotification(notification.filter((n) => n !== notif))
            }}>
            {notif.chat[0].isGroupChat
              ? `message dans ${notif.chat[0].chatName}`
              : `${getSender(user, notif.chat[0].users)} t'a laissé un message`}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  )
}

export default ChatNotification
