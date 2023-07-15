import { isEmpty } from 'lodash'

import { getUser } from '@utils'

import ChatBox from './ChatBox'
import UserChats from './UserChats'

import './Chat.scss'

export default function Chat() {
  const user = getUser()

  return (
    <>
      {!isEmpty(user) && (
        <div className="chat-container">
          <UserChats />
          <ChatBox />
        </div>
      )}
    </>
  )
}
