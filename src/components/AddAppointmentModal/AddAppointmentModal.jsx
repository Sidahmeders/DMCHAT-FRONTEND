import { useState } from 'react'
import { Modal, ModalContent, ModalOverlay, Tabs, TabList, Tab, TabPanels, TabPanel } from '@chakra-ui/react'

import { getEventTemplateButtons, addEventTemplateButtons, dropEventTemplateButton } from '../../utils'

import AddAppointmentBody from './AddAppointmentBody'
import EditableButtons from '../EditableButtons/EditableButtons'
import ConfigureCalendarAvailabilityBody from './ConfigureCalendarAvailabilityBody'

export default function AddAppointmentModal({ selectedSlotInfo, isOpen, onClose, events, setEvents }) {
  const [templateButtons, setTemplateButtons] = useState(getEventTemplateButtons())

  return (
    <Modal size="xl" isOpen={isOpen} onClose={onClose}>
      <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
      <ModalContent>
        <Tabs>
          <TabList>
            <Tab>Ajouter rendez-vous</Tab>
            <Tab onClick={() => setTemplateButtons(getEventTemplateButtons())}>modifier boutons</Tab>
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
                label="Mettre événement (btn modifiable)"
                handleClose={onClose}
                getTemplateButtons={getEventTemplateButtons}
                addTemplateButtons={addEventTemplateButtons}
                dropTemplateButton={dropEventTemplateButton}
              />
            </TabPanel>
            <TabPanel>
              <ConfigureCalendarAvailabilityBody selectedSlotInfo={selectedSlotInfo} handleClose={onClose} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </ModalContent>
    </Modal>
  )
}
