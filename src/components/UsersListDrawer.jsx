import { useEffect, useState } from 'react'
import {
  Button,
  Tooltip,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  useToast,
  Stack,
  Skeleton,
} from '@chakra-ui/react'
import { List } from 'react-feather'

import { searchUsers } from '@services/users'

import UserListItem from './UserAvatar/UserListItem'

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
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      try {
        const users = await searchUsers('')
        setUsersList(users)
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
          <DrawerCloseButton />
          <DrawerHeader>Liste des utilisateurs</DrawerHeader>

          <DrawerBody>
            {loading ? (
              <LoadingChats />
            ) : (
              usersList?.map((user) => (
                <UserListItem key={user._id} user={user} setUsersList={setUsersList} closeDrawer={onClose} />
              ))
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default UsersListDrawer
