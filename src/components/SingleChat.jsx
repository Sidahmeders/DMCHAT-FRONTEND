import { useEffect, useState } from 'react'
import {
  Box,
  FormControl,
  IconButton,
  Input,
  InputRightElement,
  InputGroup,
  Spinner,
  useToast,
  Stack,
  Text,
} from '@chakra-ui/react'
import { Send, ArrowLeft, Mail } from 'react-feather'
import { isEmpty } from 'lodash'

import { ChatState } from '@context'
import { CHAT_EVENT_LISTENERS } from '@config'
import { getSender, getSenderFull, getUser } from '@utils'
import { createMessage } from '@services/messages'

import PeerProfileModal from './miscellaneous/PeerProfileModal'
import UpdateGroupChatModal from './miscellaneous/UpdateGroupChatModal'
import ScrollableChat from './ScrollableChat'

const SingleChat = () => {
  const user = getUser()
  const toast = useToast()
  const { socket, selectedChat, setSelectedChat, messages, setMessages, isLoadingMessages, socketConnected } =
    ChatState()

  const [newMessage, setNewMessage] = useState('')
  const [typing, setTyping] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const senderName = getSender(user, selectedChat.users)

  const sendMessage = async (e) => {
    if (newMessage.trim().length < 1) return
    if (e.key !== 'Enter' && e.type !== 'click') return
    try {
      socket.emit(CHAT_EVENT_LISTENERS.STOP_TYPING, selectedChat._id)
      setNewMessage('')
      const createdMessage = await createMessage(newMessage, selectedChat._id)
      socket.emit(CHAT_EVENT_LISTENERS.NEW_MESSAGE, { createdMessage, targetChat: selectedChat })
      setMessages([...messages, createdMessage])
    } catch (error) {
      toast({ description: error.message })
    }
  }

  const typingHandler = (e) => {
    setNewMessage(e.target.value)

    if (!socketConnected) return

    if (!typing) {
      setTyping(true)
      socket.emit(CHAT_EVENT_LISTENERS.TYPING, selectedChat._id)
    }

    let lastTypingTime = new Date().getTime()
    let timerLength = 7500

    setTimeout(() => {
      let timeNow = new Date().getTime()
      let timeDiff = timeNow - lastTypingTime

      if (timeDiff >= timerLength && typing) {
        socket.emit(CHAT_EVENT_LISTENERS.STOP_TYPING, selectedChat._id)
        setTyping(false)
      }
    }, timerLength)
  }

  useEffect(() => {
    socket.on(CHAT_EVENT_LISTENERS.TYPING, (chatId) => {
      if (chatId === selectedChat?._id) {
        setIsTyping(true)
      }
    })
    socket.on(CHAT_EVENT_LISTENERS.STOP_TYPING, (chatId) => {
      if (chatId === selectedChat?._id) {
        setIsTyping(false)
      }
    })
  }, [selectedChat, socket])

  return (
    <>
      {!isEmpty(selectedChat) ? (
        <>
          <Box fontSize="1.25rem" w="100%" pb="3" display="flex" justifyContent="space-between" alignItems="center">
            <IconButton
              display={{ base: 'flex', md: 'none' }}
              icon={<ArrowLeft />}
              onClick={() => setSelectedChat('')}
            />
            {!selectedChat.isGroupChat ? (
              <>
                <Text fontWeight="500" color={senderName ? 'gray.600' : 'red.600'}>
                  {senderName || 'Compte Supprimé'}
                </Text>
                <PeerProfileModal
                  chatId={selectedChat._id}
                  sender={getSenderFull(user, selectedChat.users)}
                  setMessages={setMessages}
                />
              </>
            ) : (
              <>
                <Text fontWeight="500" color="gray.600">
                  {selectedChat.chatName.toUpperCase()}
                </Text>
                <UpdateGroupChatModal
                  chatId={selectedChat._id}
                  sender={getSenderFull(user, selectedChat.users)}
                  setMessages={setMessages}
                />
              </>
            )}
          </Box>

          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            padding="3"
            bg="gray.100"
            width="100%"
            height="100%"
            borderRadius="lg"
            overflowY="hidden">
            {isLoadingMessages ? (
              <Spinner size="xl" w="20" h="20" alignSelf="center" margin="auto" />
            ) : (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  overflowY: 'scroll',
                  scrollbarWidth: 'none',
                }}>
                <ScrollableChat messages={messages} isTyping={isTyping} />
              </div>
            )}

            <FormControl mt="3" onKeyDown={sendMessage} isRequired>
              <InputGroup>
                <Input
                  variant="filled"
                  bg="gray.300"
                  placeholder="entrer des messages.."
                  value={newMessage}
                  onChange={(e) => typingHandler(e)}
                />
                <InputRightElement cursor="pointer" mr="2" children={<Send color="#48f" />} onClick={sendMessage} />
              </InputGroup>
            </FormControl>
          </Box>
        </>
      ) : (
        <Stack justifyContent="center" alignItems="center" p="12" mt="16">
          <Mail size="50%" color="#34d9" />
          <Text fontSize="2xl" fontFamily="mono" fontWeight="bold" color="#34d9">
            Cliquez un utilisateur à discuter
          </Text>
        </Stack>
      )}
    </>
  )
}

export default SingleChat
