import _fetch from './_fetch'

const searchUsers = async (searchQuery) => await _fetch.GET(`/api/users?search=${searchQuery}`)

const signInUser = async (credentials) => {
  return await _fetch.POST('/api/users/login', {
    email: credentials.email,
    password: credentials.password,
  })
}

const confirmSignIn = async (data) => {
  return await _fetch.POST('/api/users/login-confirmation', data)
}

const signUpUser = async (credentials) => {
  return await _fetch.POST('/api/users', {
    name: credentials.name,
    email: credentials.email,
    password: credentials.password,
    pic: credentials.pic,
  })
}

const requestPasswordReset = async (email) => await _fetch.POST('/api/users/forget-password', { email })

const updateUser = async ({ id, email }, userData) => {
  const searchQuery = [id && `id=${id}`, email && `email=${email}`].filter((query) => query).join('&')
  return await _fetch.PUT(`/api/users?${searchQuery}`, userData)
}

export { searchUsers, signInUser, confirmSignIn, signUpUser, requestPasswordReset, updateUser }
