import { getUser } from '@utils'

class Fetch {
  #user
  constructor(user = getUser()) {
    this.#user = user
  }

  async GET(url) {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.#user.token}`,
      },
    })

    return await response.json()
  }

  async POST(url, body) {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.#user.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    return await response.json()
  }

  async PUT(url, body) {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.#user.token}`,
      },
      body: JSON.stringify(body),
    })

    return await response.json()
  }

  async DELETE(url) {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${this.#user.token}`,
      },
    })

    return response.status
  }
}

export default Fetch
