import { useState } from 'react'
import { Modal, ModalContent, ModalOverlay, Tabs, TabList, Tab, TabPanels, TabPanel } from '@chakra-ui/react'

import { getMotifTemplateButtons, addMotifTemplateButtons, dropMotifTemplateButton } from '@utils'

import AddAppointmentBody from './AddAppointmentBody'
import EditableButtons from '../EditableButtons/EditableButtons'
import ConfigureCalendarAvailabilityBody from './ConfigureCalendarAvailabilityBody'

export default function AddAppointmentModal({
  selectedSlotInfo,
  isOpen,
  onClose,
  events,
  setEvents,
  setAvailabilities,
}) {
  const [templateButtons, setTemplateButtons] = useState(getMotifTemplateButtons())

  return (
    <Modal size="xl" isOpen={isOpen} onClose={onClose}>
      <ModalOverlay bg="blackAlpha.400" />
      <ModalContent>
        <Tabs>
          <TabList>
            <Tab>Ajouter rendez-vous</Tab>
            <Tab onClick={() => setTemplateButtons(getMotifTemplateButtons())}>modifier boutons</Tab>
            <Tab>définir la disponibilité</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <AddAppointmentBody
                selectedSlotInfo={selectedSlotInfo}
                templateButtons={templateButtons}
                handleClose={onClose}
                events={events}
                setEvents={setEvents}
              />
            </TabPanel>
            <TabPanel>
              <EditableButtons
                label="Motif de consultation (btn modifiable)"
                handleClose={onClose}
                getTemplateButtons={getMotifTemplateButtons}
                addTemplateButtons={addMotifTemplateButtons}
                dropTemplateButton={dropMotifTemplateButton}
              />
            </TabPanel>
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
