import { getUser } from '@utils'

class Fetch {
  #user
  constructor(user = getUser()) {
    if (!Fetch.instance) {
      this.#user = user
      Fetch.instance = this
    }
    return Fetch.instance
  }

  async GET(url) {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.#user.token}`,
      },
    })
    const { data, error } = await response.json()

    if (error) {
      throw new Error(error.message)
    }

    return data
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
    const { data, error } = await response.json()

    if (error) {
      throw new Error(error.message)
    }

    return data
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
    const { data, error } = await response.json()

    if (error) {
      throw new Error(error.message)
    }

    return data
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

const _fetch = new Fetch()

export default _fetch
