import { useEffect, useRef, useState } from 'react'
import { MessageCircle } from 'react-feather'
import {
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalHeader,
  ModalFooter,
  ModalCloseButton,
  FormControl,
  Input,
  Button,
} from '@chakra-ui/react'
import { omit } from 'lodash'
import io from 'socket.io-client'

import { ENDPOINT, APPOINTMENTS_LISTENERS, APPOINTMENTS_EVENTS } from '../../config'
import { guid } from '../../utils'
import { ChatState } from '../../context'

import ScrollableChat from '../../components/ScrollableChat'

const HARD_MESSAGES = [
  {
    _id: '643c85c1c32692863906b43b',
    sender: {
      _id: '64151aafe15bee4d0e1f12a9',
      name: 'Ahmed Boutaraa',
      email: 'guest@example.com',
      pic: 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg',
    },
    content: 'dolor sit amet, consectetur?',
    chat: [
      {
        _id: '6435506d5e6174341eeb3d52x',
        chatName: 'sender',
        isGroupChat: false,
        users: ['64151aafe15bee4d0e1f12a9', '64151b22e15bee4d0e1f12bc'],
        createdAt: '2023-04-11T12:19:57.459Z',
        updatedAt: '2023-04-17T23:00:25.991Z',
        __v: 0,
        latestMessage: '643dcf898ab0ed0f69cd07ff',
      },
    ],
    createdAt: '2023-04-16T23:33:21.907Z',
    updatedAt: '2023-04-16T23:33:21.907Z',
    __v: 0,
  },
  {
    _id: '643c85ddc32692863906b44c',
    sender: {
      _id: '64151b22e15bee4d0e1f12bc',
      name: 'Deghamine Amine',
      email: 'admin@gmail.com',
      pic: 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg',
    },
    content: 'adipiscing elit. Proin augue est, venenatis nec egestas',
    chat: [
      {
        _id: '6435506d5e6174341eeb3d5s2',
        chatName: 'sender',
        isGroupChat: false,
        users: ['64151aafe15bee4d0e1f12a9', '64151b22e15bee4d0e1f12bc'],
        createdAt: '2023-04-11T12:19:57.459Z',
        updatedAt: '2023-04-17T23:00:25.991Z',
        __v: 0,
        latestMessage: '643dcf898ab0ed0f69cd07ff',
      },
    ],
    createdAt: '2023-04-16T23:33:49.473Z',
    updatedAt: '2023-04-16T23:33:49.473Z',
    __v: 0,
  },
  {
    _id: '643dcf898ab0ed0f69cd07ff',
    sender: {
      _id: '64151aafe15bee4d0e1f12a9',
      name: 'Ahmed Boutaraa',
      email: 'guest@example.com',
      pic: 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg',
    },
    content: 'quis, tempor sed est Nullam magna mauris.',
    chat: [
      {
        _id: '6435506d5e6174341eeb3d52',
        chatName: 'sender',
        isGroupChat: false,
        users: ['64151aafe15bee4d0e1f12a9', '64151b22e15bee4d0e1f12bc'],
        createdAt: '2023-04-11T12:19:57.459Z',
        updatedAt: '2023-04-17T23:00:25.991Z',
        __v: 0,
        latestMessage: '643dcf898ab0ed0f69cd07ff',
      },
    ],
    createdAt: '2023-04-17T23:00:25.485Z',
    updatedAt: '2023-04-17T23:00:25.485Z',
    __v: 0,
  },
  {
    _id: '643c85ddc32692863906b44cf',
    sender: {
      _id: '64151b22e15bee4d0e1f12xbc',
      name: 'Deghamine Amine',
      email: 'admin@gmail.com',
      pic: 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg',
    },
    content: 'rutrum tempor tristique ultrices',
    chat: [
      {
        _id: '6435506d5e6174341eeb3d52',
        chatName: 'sender',
        isGroupChat: false,
        users: ['64151aafe15bee4d0e1f12a9', '64151b22e15bee4d0e1f12bc'],
        createdAt: '2023-04-11T12:19:57.459Z',
        updatedAt: '2023-04-17T23:00:25.991Z',
        __v: 0,
        latestMessage: '643dcf898ab0ed0f69cd07ff',
      },
    ],
    createdAt: '2023-04-16T23:33:49.473Z',
    updatedAt: '2023-04-16T23:33:49.473Z',
    __v: 0,
  },
  {
    _id: '643c85ddc326928639x06b44cf',
    sender: {
      _id: '64151b22e15bee4d0e1f12bc',
      name: 'Deghamine Amine',
      email: 'admin@gmail.com',
      pic: 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg',
    },
    content: 'sapien elit rhoncus erat, sed lacinia magna felis nec risus',
    chat: [
      {
        _id: '6435506d5e617434x1eeb3d52',
        chatName: 'sender',
        isGroupChat: false,
        users: ['64151aafe15bee4d0e1f12a9', '64151b22e15bee4d0e1f12bc'],
        createdAt: '2023-04-11T12:19:57.459Z',
        updatedAt: '2023-04-17T23:00:25.991Z',
        __v: 0,
        latestMessage: '643dcf898ab0ed0f69cd07ff',
      },
    ],
    createdAt: '2023-04-16T23:33:49.473Z',
    updatedAt: '2023-04-16T23:33:49.473Z',
    __v: 0,
  },
  {
    _id: '643c85ddc3269286390609b44c',
    sender: {
      _id: '64151aafe15bee4d0e1f12a9',
      name: 'Deghamine Amine',
      email: 'admin@gmail.com',
      pic: 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg',
    },
    content: 'bibendum lacus non sollicitudin. Aenean efficitur',
    chat: [
      {
        _id: '6435506d5e6174341eeb3d5s2',
        chatName: 'sender',
        isGroupChat: false,
        users: ['64151aafe15bee4d0e1f12a9', '64151b22e15bee4d0e1f12bc'],
        createdAt: '2023-04-11T12:19:57.459Z',
        updatedAt: '2023-04-17T23:00:25.991Z',
        __v: 0,
        latestMessage: '643dcf898ab0ed0f69cd07ff',
      },
    ],
    createdAt: '2023-04-16T23:33:49.473Z',
    updatedAt: '2023-04-16T23:33:49.473Z',
    __v: 0,
  },
]

let socket

export default function AppointmentChatModal({ appointment }) {
  const { user } = ChatState()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const finalRef = useRef(null)

  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [typing, setTyping] = useState(false)
  const isTyping = false

  const sendChatMessage = (e) => {
    if (e.key !== 'Enter') return
    socket.emit(APPOINTMENTS_EVENTS.MESSAGE_APPOINTMENT, {
      _id: guid(),
      content: newMessage,
      sender: omit(user, ['token', 'success', 'statusCode', 'message']),
      appointmentId: appointment._id,
    })
    setNewMessage('')
  }

  const typingHandler = (e) => {
    setNewMessage(e.target.value)

    if (!typing) {
      setTyping(true)
    }

    let lastTypingTime = new Date().getTime()
    let timerLength = 15000

    setTimeout(() => {
      let timeNow = new Date().getTime()
      let timeDiff = timeNow - lastTypingTime

      if (timeDiff >= timerLength && typing) {
        setTyping(false)
      }
    }, timerLength)
  }

  useEffect(() => {
    setMessages(HARD_MESSAGES)
  }, [])

  useEffect(() => {
    if (socket === undefined) {
      socket = io(ENDPOINT)
    }

    socket.on(APPOINTMENTS_LISTENERS.APPOINTMENT_MESSAGED, (payload) => {
      if (payload.appointmentId === appointment.id) {
        setMessages([...messages, payload])
      }
    })
  }, [appointment, messages])

  const messageIconColor = appointment.age > 30 && { color: 'red', fill: '#f003' }
  const unreadMessages = Math.floor(Math.random() * 4) + 1

  return (
    <>
      <Button
        flex="2"
        variant="ghost"
        pr="2"
        colorScheme="messenger"
        leftIcon={<MessageCircle {...messageIconColor} />}
        onClick={onOpen}>
        {messageIconColor.fill && <span style={{ color: 'red' }}>{unreadMessages}</span>}
      </Button>
      <Modal closeOnOverlayClick={false} size="2xl" finalFocusRef={finalRef} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent height="xl">
          <ModalHeader>(nom d'utilisateur) / (âge)</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <ScrollableChat messages={messages} isTyping={isTyping} />
          </ModalBody>
          <ModalFooter>
            <FormControl onKeyDown={sendChatMessage} isRequired>
              <Input
                variant="filled"
                bg="#E0E0E0"
                placeholder="entrer des messages.."
                value={newMessage}
                onChange={typingHandler}
              />
            </FormControl>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
