import { useState } from 'react'
import propTypes from 'prop-types'
import { ModalBody, ModalFooter, Button, Input, Stack, StackItem } from '@chakra-ui/react'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'

import './EditableButtons.scss'

const BUTTONS_CONTAINER_ID = 'EDITABLE_BUTTONS'
const DROP_BOX_ID = 'DROP_BOX'

export default function EditableButtons({
  label,
  handleClose,
  getTemplateButtons,
  addTemplateButtons,
  dropTemplateButton,
}) {
  const [value, setValue] = useState('')
  const [templateButtons, setTemplateButtons] = useState(getTemplateButtons())
  const [isDropBoxHover, setIsDropBoxHover] = useState(false)

  const addNewTemplate = () => {
    if (!value?.trim().length) return
    addTemplateButtons(value)
    setValue('')
    setTemplateButtons(getTemplateButtons())
  }

  const onDragEnd = (props) => {
    const { draggableId, destination } = props
    const { droppableId: destinationDroppableId } = destination || {}

    if (destinationDroppableId === DROP_BOX_ID) {
      dropTemplateButton(draggableId)
      setTemplateButtons(getTemplateButtons())
    }
    setIsDropBoxHover(false)
  }

  const onDragUpdate = (props) => {
    const { droppableId: destinationDroppableId } = props?.destination || {}
    if (destinationDroppableId === DROP_BOX_ID) {
      setIsDropBoxHover(true)
    } else {
      setIsDropBoxHover(false)
    }
  }

  return (
    <div className="editable-buttons-container">
      <ModalBody>
        <DragDropContext onDragUpdate={onDragUpdate} onDragEnd={onDragEnd}>
          <Droppable droppableId={BUTTONS_CONTAINER_ID}>
            {(provided) => (
              <Stack spacing={4} ref={provided.innerRef} {...provided.droppableProps}>
                <Input type="text" placeholder={label} value={value} onChange={(e) => setValue(e.target.value)} />
                <StackItem>
                  {templateButtons.length ? (
                    templateButtons.map((btn, index) => (
                      <Draggable key={btn.id} draggableId={btn.id} index={index}>
                        {(provided) => (
                          <div
                            className={`editable-button ${btn.isRequired ? 'required' : ''}`}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}>
                            {btn.name}
                          </div>
                        )}
                      </Draggable>
                    ))
                  ) : (
                    <Button size="sm" colorScheme="telegram">
                      exemple (ne s'affichera pas)
                    </Button>
                  )}
                </StackItem>
                {provided.placeholder}
              </Stack>
            )}
          </Droppable>

          <Droppable droppableId={DROP_BOX_ID}>
            {(provided) => (
              <div className="drop-box-container" ref={provided.innerRef} {...provided.droppableProps}>
                <p className="drop-box-text">{isDropBoxHover ? 'relâcher pour supprimer' : 'déposez bouton ici'}</p>
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </ModalBody>

      <ModalFooter pb="0">
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
