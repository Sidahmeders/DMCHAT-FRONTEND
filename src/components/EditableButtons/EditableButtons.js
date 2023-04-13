import { useState } from 'react'
import { ModalBody, ModalFooter, Button, Badge, Input, Stack, StackItem } from '@chakra-ui/react'
import propTypes from 'prop-types'

import { guid } from '../../utils'

export default function EditableButtons({
  label,
  handleClose,
  getTemplateButtons,
  addTemplateButtons,
  dropTemplateButton,
}) {
  const [value, setValue] = useState()
  const [templateButtons, setTemplateButtons] = useState(getTemplateButtons())

  const addNewTemplate = () => {
    if (!value?.trim().length) return
    addTemplateButtons({ id: guid(), name: value })
    setValue('')
    setTemplateButtons(getTemplateButtons())
  }

  return (
    <div className="editable-buttons-container">
      <ModalBody>
        <Stack spacing={4}>
          <Input type="text" placeholder={label} />

          <StackItem>
            {templateButtons.length ? (
              templateButtons.map(({ id, name }) => <Badge margin="2">{name}</Badge>)
            ) : (
              <Badge colorScheme="purple">exemple (ne s'affichera pas)</Badge>
            )}
          </StackItem>
        </Stack>

        <div
          className="drop-button-container"
          style={{ width: '100%', height: '3rem', border: '2px solid red', marginTop: '1rem' }}></div>
      </ModalBody>

      <ModalFooter>
        <Button colorScheme="blue" mr={3} onClick={addNewTemplate}>
          Ajouter bouton
        </Button>
        <Button variant="ghost" onClick={handleClose}>
          Annuler
        </Button>
      </ModalFooter>
    </div>
  )
}

EditableButtons.propTypes = {
  label: propTypes.string,
  handleClose: propTypes.func,
  getTemplateButtons: propTypes.func,
  addTemplateButtons: propTypes.func,
  dropTemplateButton: propTypes.func,
}

EditableButtons.defaultProps = {
  label: '...(btn modifiable)',
  handleClose: () => {},
  getTemplateButtons: () => {},
  addTemplateButtons: () => {},
  dropTemplateButton: () => {},
}
