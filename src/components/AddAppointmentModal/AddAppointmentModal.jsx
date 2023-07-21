import { useState } from 'react'
import { Modal, ModalContent, ModalOverlay, Tabs, TabList, Tab, TabPanels, TabPanel } from '@chakra-ui/react'

import { getMotifTemplateButtons, addMotifTemplateButtons, dropMotifTemplateButton } from '@utils'

import AddAppointmentBody from './AddAppointmentBody'
import EditableButtons from '../EditableButtons/EditableButtons'
import ConfigureCalendarAvailabilityBody from './ConfigureCalendarAvailabilityBody'

const AddAppointmentModal = ({ selectedView, selectedSlotInfo, isOpen, onClose, setEvents, setAvailabilities }) => {
  const { action } = selectedSlotInfo
  const canAddAppointment = action === 'click' || selectedView === 'day'
  const [templateButtons, setTemplateButtons] = useState(getMotifTemplateButtons())

  return (
    <Modal size="xl" isOpen={isOpen} onClose={onClose}>
      <ModalOverlay bg="blackAlpha.400" />
      <ModalContent>
        <Tabs onClick={() => setTemplateButtons(getMotifTemplateButtons())}>
          <TabList>
            {canAddAppointment && <Tab>Ajouter rendez-vous</Tab>}
            {canAddAppointment && <Tab>Modifier boutons</Tab>}
            <Tab>Définir la disponibilité</Tab>
          </TabList>

          <TabPanels>
            {canAddAppointment && (
              <TabPanel>
                <AddAppointmentBody
                  selectedSlotInfo={selectedSlotInfo}
                  templateButtons={templateButtons}
                  handleClose={onClose}
                  setEvents={setEvents}
                />
              </TabPanel>
            )}
            {canAddAppointment && (
              <TabPanel>
                <EditableButtons
                  label="Motif de consultation (btn modifiable)"
                  handleClose={onClose}
                  getTemplateButtons={getMotifTemplateButtons}
                  addTemplateButtons={addMotifTemplateButtons}
                  dropTemplateButton={dropMotifTemplateButton}
                />
              </TabPanel>
            )}
            <TabPanel>
              <ConfigureCalendarAvailabilityBody
                selectedSlotInfo={selectedSlotInfo}
                setAvailabilities={setAvailabilities}
                handleClose={onClose}
              />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </ModalContent>
    </Modal>
  )
}

export default AddAppointmentModal
