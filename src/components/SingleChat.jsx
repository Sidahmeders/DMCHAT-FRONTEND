import { useEffect, useState } from 'react'
import { ArrowBackIcon } from '@chakra-ui/icons'
import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react'
import io from 'socket.io-client'

import { ChatState } from '../context'
import { ENDPOINT } from '../config'
import { getSender, getSenderFull } from '../utils'
import ProfileModal from './miscellaneous/ProfileModal'
import UpdateGroupChatModal from './miscellaneous/UpdateGroupChatModal'
import ScrollableChat from './ScrollableChat'

let socket, selectedChatCompare

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [socketConnected, setSocketConnected] = useState(false)
  const [typing, setTyping] = useState(false)
  const [isTyping, setIsTyping] = useState(false)

  const { user, selectedChat, setSelectedChat, notification, setNotification } = ChatState()
  const toast = useToast()

  const fetchMessages = async () => {
    if (!selectedChat) return
    setLoading(true)
    try {
      const response = await fetch(`/api/message/${selectedChat._id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      if (response.status === 200) {
        setMessages(await response.json())
        socket.emit('join chat', selectedChat._id)
      }
    } catch (error) {
      return toast({
        title: 'Error Occured!',
        description: 'Failed to Load the Messages',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom-right',
        variant: 'solid',
      })
    }
    setLoading(false)
  }

  const sendMessage = async (e) => {
    // Check if 'Enter' key is pressed and we have something inside 'newMessage'
    if (e.key === 'Enter' && newMessage) {
      socket.emit('stop typing', selectedChat._id)
      try {
        setNewMessage('') // Clear message field before making API call (won't affect API call as the function is asynchronous)

        const response = await fetch('/api/message', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content: newMessage,
            chatId: selectedChat._id,
          }),
        })

        if (response.status === 200) {
          const data = await response.json()
          socket.emit('new message', data)
          setNewMessage('')
          setMessages([...messages, data])
        }
      } catch (error) {
        return toast({
          title: 'Error Occured!',
          description: 'Failed to send the Message',
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'bottom-right',
          variant: 'solid',
        })
      }
    }
  }

  const typingHandler = (e) => {
    setNewMessage(e.target.value)

    // Typing Indicator Logic
    if (!socketConnected) return

    if (!typing) {
      setTyping(true)
      socket.emit('typing', selectedChat._id)
    }

    let lastTypingTime = new Date().getTime()
    let timerLength = 15000

    setTimeout(() => {
      let timeNow = new Date().getTime()
      let timeDiff = timeNow - lastTypingTime

      if (timeDiff >= timerLength && typing) {
        socket.emit('stop typing', selectedChat._id)
        setTyping(false)
      }
    }, timerLength)
  }

  useEffect(() => {
    socket = io(ENDPOINT)
    socket.emit('setup', user)
    socket.on('connected', () => setSocketConnected(true))

    socket.on('typing', () => setIsTyping(true))
    socket.on('stop typing', () => setIsTyping(false))

    return () => {
      selectedChatCompare = undefined
    }
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    fetchMessages() // Whenever users switches chat, call the function again
    selectedChatCompare = selectedChat
    // eslint-disable-next-line
  }, [selectedChat])

  useEffect(() => {
    socket.on('message recieved', (newMessageRecieved) => {
      if (!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat[0]._id) {
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification])
          setFetchAgain(!fetchAgain) // Fetch all the chats again
        }
      } else {
        setMessages([...messages, newMessageRecieved])
      }
    })

    // eslint-disable-next-line
  })

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: '28px', md: '30px' }}
            pb="3"
            px="2"
            w="100%"
            display="flex"
            justifyContent={{ base: 'space-between' }}
            alignItems="center">
            <IconButton
              display={{ base: 'flex', md: 'none' }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat('')}
            />
            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                />
              </>
            )}
          </Text>

          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden">
            {loading ? (
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

            <FormControl mt="3" onKeyDown={(e) => sendMessage(e)} isRequired>
              <Input
                variant="filled"
                bg="#E0E0E0"
                placeholder="entrer des messages.."
                value={newMessage}
                onChange={(e) => typingHandler(e)}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box display="flex" alignItems="center" justifyContent="center" h="100%">
          <Text fontSize="3xl" pb="3">
            Cliquez un utilisateur à discuter
          </Text>
        </Box>
      )}
    </>
  )
}

export default SingleChat
