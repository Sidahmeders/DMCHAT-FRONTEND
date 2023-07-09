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

export { searchUsers, signInUser, confirmSignIn, signUpUser, requestPasswordReset }
