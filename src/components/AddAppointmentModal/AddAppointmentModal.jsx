import { useState } from 'react'
import { Modal, ModalContent, ModalOverlay, Tabs, TabList, Tab, TabPanels, TabPanel } from '@chakra-ui/react'

import { getEventTemplateButtons, addEventTemplateButtons, dropEventTemplateButton } from '../../utils'

import AddAppointmentBody from './AddAppointmentBody'
import EditableButtons from '../EditableButtons/EditableButtons'
import ConfigureCalendarAvailability from './ConfigureCalendarAvailability'

export default function AddAppointmentModal({ selectedSlotInfo, events, setEvents, isOpen, onClose }) {
  const [templateButtons, setTemplateButtons] = useState(getEventTemplateButtons())

  return (
    <Modal size="lg" isOpen={isOpen} onClose={onClose}>
      <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
      <ModalContent>
        <Tabs>
          <TabList>
            <Tab>Ajouter rendez-vous</Tab>
            <Tab onClick={() => setTemplateButtons(getEventTemplateButtons())}>modifier boutons</Tab>
            <Tab>définir la disponibilité</Tab>
          </TabList>

          <TabPanels>
            <TabPanel pb={0}>
              <AddAppointmentBody
                selectedSlotInfo={selectedSlotInfo}
                templateButtons={templateButtons}
                handleClose={onClose}
              />
            </TabPanel>
            <TabPanel pb={0}>
              <EditableButtons
                label="Mettre événement (btn modifiable)"
                handleClose={onClose}
                getTemplateButtons={getEventTemplateButtons}
                addTemplateButtons={addEventTemplateButtons}
                dropTemplateButton={dropEventTemplateButton}
              />
            </TabPanel>
            <TabPanel>
              <ConfigureCalendarAvailability
                events={events}
                setEvents={setEvents}
                selectedSlotInfo={selectedSlotInfo}
                handleClose={onClose}
              />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </ModalContent>
    </Modal>
  )
}