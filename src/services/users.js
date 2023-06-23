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

const signInUser = async (credentials) => {
  const response = await fetch('/api/users/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: credentials.email,
      password: credentials.password,
    }),
  })

  return await response.json()
}

const signUpUser = async (credentials) => {
  const response = await fetch('/api/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: credentials.name,
      email: credentials.email,
      password: credentials.password,
      pic: credentials.pic,
    }),
  })

  return await response.json()
}

export { searchUsers, signInUser, signUpUser }
