import { useEffect, useState } from 'react'
import {
  Button,
  Tooltip,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  useToast,
  Stack,
  Skeleton,
  IconButton,
  HStack,
  Text,
} from '@chakra-ui/react'
import { motion, AnimatePresence } from 'framer-motion'
import { Circle, List, Target } from 'react-feather'

import { searchUsers } from '@services/users'
import { fetchGroupChats } from '@services/chats'

import UserListItem from './UserListItem'
import GroupChatItem from './GroupChatItem'

const LoadingChats = () => (
  <Stack>
    <Skeleton height="45px" />
    <Skeleton height="45px" />
    <Skeleton height="45px" />
  </Stack>
)

const UsersListDrawer = () => {
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [usersList, setUsersList] = useState([])
  const [groupChatsList, setGroupChatsList] = useState([])
  const [loading, setLoading] = useState(false)
  const [showGrouplist, setShowGrouplist] = useState(false)

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      try {
        const users = await searchUsers()
        setUsersList(users)
        const groupChats = await fetchGroupChats()
        setGroupChatsList(groupChats)
      } catch (error) {
        toast({ description: error.message })
      }
      setLoading(false)
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <Tooltip label="Liste des utilisateurs" hasArrow>
        <Button p="0" onClick={onOpen}>
          <List />
        </Button>
      </Tooltip>

      <Drawer size="sm" placement="left" isOpen={isOpen} onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader>
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1 }}
                whileTap={{ scale: 0.75 }}>
                <HStack w="100%" justifyContent="space-between">
                  <Text color="purple.500">{showGrouplist ? 'Liste de Groupe' : 'Liste des Utilisateurs'}</Text>
                  <IconButton
                    variant="ghost"
                    colorScheme="purple"
                    opacity="0.75"
                    size="sm"
                    icon={showGrouplist ? <Target /> : <Circle />}
                    onClick={() => setShowGrouplist((prevState) => !prevState)}
                  />
                </HStack>
              </motion.div>
            </AnimatePresence>
          </DrawerHeader>
          {!showGrouplist ? (
            <>
              <DrawerBody>
                {loading ? (
                  <LoadingChats />
                ) : (
                  usersList?.map((user) => (
                    <UserListItem key={user._id} user={user} setUsersList={setUsersList} closeDrawer={onClose} />
                  ))
                )}
              </DrawerBody>
            </>
          ) : (
            <>
              <DrawerBody height="max">
                {loading ? (
                  <LoadingChats />
                ) : (
                  groupChatsList?.map((chatGroup) => <GroupChatItem key={chatGroup._id} chatGroup={chatGroup} />)
                )}
              </DrawerBody>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default UsersListDrawer
