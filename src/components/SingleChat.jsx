import { useEffect, useState } from 'react'
import { ArrowBackIcon } from '@chakra-ui/icons'
import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react'

import { ChatState } from '@context'
import { getSender, getSenderFull } from '@utils'
import { CHAT_EVENTS, CHAT_LISTENERS } from '@config'

import PeerProfileModal from './miscellaneous/PeerProfileModal'
import UpdateGroupChatModal from './miscellaneous/UpdateGroupChatModal'
import ScrollableChat from './ScrollableChat'

const SingleChat = () => {
  const [newMessage, setNewMessage] = useState('')
  const [typing, setTyping] = useState(false)
  const [isTyping, setIsTyping] = useState(false)

  const toast = useToast()
  const {
    user,
    socket,
    selectedChat,
    setSelectedChat,
    messages,
    setMessages,
    fetchMessages,
    isLoadingMessages,
    fetchAgain,
    setFetchAgain,
    socketConnected,
  } = ChatState()

  const sendMessage = async (e) => {
    // Check if 'Enter' key is pressed and we have something inside 'newMessage'
    if (e.key === 'Enter' && newMessage) {
      socket.emit(CHAT_EVENTS.STOP_TYPING, selectedChat._id)
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
          socket.emit(CHAT_EVENTS.NEW_MESSAGE, data)
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
      socket.emit(CHAT_EVENTS.TYPING, selectedChat._id)
    }

    let lastTypingTime = new Date().getTime()
    let timerLength = 15000

    setTimeout(() => {
      let timeNow = new Date().getTime()
      let timeDiff = timeNow - lastTypingTime

      if (timeDiff >= timerLength && typing) {
        socket.emit(CHAT_EVENTS.STOP_TYPING, selectedChat._id)
        setTyping(false)
      }
    }, timerLength)
  }

  useEffect(() => {
    socket.on(CHAT_LISTENERS.TYPING, (chatId) => {
      if (chatId === selectedChat?._id) {
        setIsTyping(true)
      }
    })
    socket.on(CHAT_LISTENERS.STOP_TYPING, (chatId) => {
      if (chatId === selectedChat?._id) {
        setIsTyping(false)
      }
    })
  }, [selectedChat, socket])

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
                <PeerProfileModal sender={getSenderFull(user, selectedChat.users)} />
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
