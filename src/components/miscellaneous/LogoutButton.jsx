import { useNavigate } from 'react-router-dom'
import { Button, Tooltip } from '@chakra-ui/react'
import { LogOut } from 'react-feather'

export default function LogoutButton() {
  const navigate = useNavigate()

  const onLogout = () => {
    localStorage.removeItem('userInfo')
    navigate('/')
  }

  return (
    <Tooltip label="Se déconnecter" hasArrow>
      <Button p="0" onClick={onLogout}>
        <LogOut color="red" />
      </Button>
    </Tooltip>
  )
}
