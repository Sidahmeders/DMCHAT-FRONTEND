import { useState } from 'react'
import { ModalBody, ModalFooter, Button, Input, Stack, StackItem } from '@chakra-ui/react'
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
    <>
      <ModalBody>
        <Stack spacing={4}>
          <Input type="text" placeholder={label} />

          <StackItem>
            {templateButtons.length ? (
              templateButtons.map(({ id, name }) => (
                <Button size="sm" margin="2">
                  {name}
                </Button>
              ))
            ) : (
              <Button size="sm" colorScheme="telegram">
                exemple (ne s'affichera pas)
              </Button>
            )}
          </StackItem>
        </Stack>

        <div
          style={{
            width: '100%',
            height: '3rem',
            border: '2px dashed #f009',
            borderRadius: '0.5rem',
            marginTop: '1rem',
            backgroundColor: '#f003',
          }}></div>
      </ModalBody>

      <ModalFooter>
        <Button colorScheme="blue" mr={3} onClick={addNewTemplate}>
          Ajouter bouton
        </Button>
        <Button variant="ghost" onClick={handleClose}>
          Annuler
        </Button>
      </ModalFooter>
    </>
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
