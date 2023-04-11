import { Menu, MenuButton, MenuItem, MenuList, Text } from '@chakra-ui/react'
import { BellIcon } from '@chakra-ui/icons'

import { ChatState } from '../../context/ChatProvider'
import { getSender } from '../../config/ChatLogics'

const ChatNotification = () => {
  const { user, setSelectedChat, notification, setNotification } = ChatState()

  return (
    <Menu>
      <MenuButton p="1" className="notification-badge-container">
        <BellIcon fontSize="2xl" m="1" />

        {notification.length > 0 && (
          <span className="notification-badge">{notification.length > 9 ? '9+' : notification.length}</span>
        )}
      </MenuButton>

      <MenuList>
        {!notification.length && <Text pl="2">pas de nouveaux message</Text>}
        {notification.map((notif) => (
          <MenuItem
            key={notif._id}
            onClick={() => {
              setSelectedChat(notif.chat[0])
              setNotification(notification.filter((n) => n !== notif))
            }}>
            {notif.chat.isGroupChat
              ? `New Message in ${notif.chat[0].chatName}`
              : `New Message from ${getSender(user, notif.chat[0].users)}`}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  )
}

export default ChatNotification
