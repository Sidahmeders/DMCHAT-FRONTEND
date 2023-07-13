import { useRef, useState } from 'react'
import {
  Box,
  Avatar,
  Text,
  Stack,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverArrow,
  PopoverBody,
  HStack,
  IconButton,
  Button,
} from '@chakra-ui/react'

import { USER_ROLES_MAP } from '@config'
import { formatMessageDate } from '@utils'
import { ChevronDown, ChevronUp } from 'react-feather'

const UsersListPopover = ({ chatGroup }) => {
  const initialFocusRef = useRef()
  const slicedUsers = chatGroup?.users?.slice(0, 4) || []

  return (
    <Popover initialFocusRef={initialFocusRef} placement="bottom-end">
      <PopoverTrigger>
        <Avatar cursor="pointer" name={chatGroup.chatName} h="10" w="10" size="md" mr="3" />
      </PopoverTrigger>
      <PopoverContent color="white" bg="#474aff">
        <PopoverHeader pt={4} fontWeight="bold" border="0">
          <HStack justifyContent="space-between">
            <Text color="red.200" fontWeight="extrabold">
              Groupe Utilisateurs :
            </Text>
            <Box>
              {slicedUsers.map((user) => (
                <Avatar key={user._id} size="xs" src={user.pic} m="0" p="0" />
              ))}
              {slicedUsers.length !== chatGroup?.users?.length ? '..' : ''}
            </Box>
          </HStack>
        </PopoverHeader>
        <PopoverArrow bg="#474affee" />
        <PopoverBody>
          {chatGroup?.users?.map((user) => (
            <HStack key={user._id} w="100%" justifyContent="space-between">
              <Text>{user?.name?.slice(0, 20)}</Text>
              <Text color="orange.200">{USER_ROLES_MAP[user.role]}</Text>
            </HStack>
          ))}
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}

const GroupChatItem = ({ chatGroup }) => {
  const [showMore, setShowMore] = useState(false)
  const [canDeleteGroup, setCanDeleteGroup] = useState(false)

  const deleteGroupChat = async () => {
    // TODO: Delete chat by Id
  }

  const cancelHanlder = () => {
    setCanDeleteGroup(false)
    setShowMore(false)
  }

  return (
    <Stack gap="2" bg="#E8E8E8" p="3" mb="2" borderRadius="lg" position="relative">
      <Box display="flex" alignItems="center">
        <UsersListPopover chatGroup={chatGroup} />
        <Stack>
          <Text>{chatGroup.chatName}</Text>
          <Text fontSize="12" color="blue" style={{ margin: '0' }}>
            {chatGroup?.latestMessage?.content.slice(0, 50)}..
          </Text>
        </Stack>
        <Stack position="absolute" top="2" right="3" alignItems="flex-end" justifyContent="space-between" h="80%">
          <Text color="purple.400" fontSize="12">
            {formatMessageDate(chatGroup?.latestMessage?.createdAt)}
          </Text>
          <IconButton
            variant="ghost"
            size="sm"
            transform="translateX(5px)"
            icon={showMore ? <ChevronUp /> : <ChevronDown />}
            onClick={() => setShowMore(!showMore)}
          />
        </Stack>
      </Box>
      {showMore && (
        <Box>
          <HStack>
            {canDeleteGroup ? (
              <Button size="sm" colorScheme="red" onClick={deleteGroupChat}>
                Supprimer définitivement
              </Button>
            ) : (
              <Button size="sm" colorScheme="orange" onClick={setCanDeleteGroup}>
                Supprimer le groupe
              </Button>
            )}
            <Button size="sm" onClick={cancelHanlder}>
              Annuler
            </Button>
          </HStack>
        </Box>
      )}
    </Stack>
  )
}

export default GroupChatItem
