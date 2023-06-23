import { getUser } from '@utils'

const user = getUser()

const searchUsers = async (searchQuery) => {
  const response = await fetch(`/api/users?search=${searchQuery}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  })

  return await response.json()
}

export { searchUsers }
