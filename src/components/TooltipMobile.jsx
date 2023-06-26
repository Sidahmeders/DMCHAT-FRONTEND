import { useState } from 'react'
import { Tooltip } from '@chakra-ui/react'

const TooltipMobile = (props) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <button
      style={{ all: 'unset', cursor: 'pointer' }}
      onMouseOver={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      onClick={() => setIsOpen((openState) => !openState)}>
      <Tooltip isOpen={isOpen} {...props}>
        {props.children}
      </Tooltip>
    </button>
  )
}

export default TooltipMobile
