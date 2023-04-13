import { useState } from 'react'
import { Modal, ModalContent, ModalOverlay, Tabs, TabList, Tab, TabPanels, TabPanel } from '@chakra-ui/react'

import { getEventTemplateButtons, addEventTemplateButtons, dropEventTemplateButton } from '../../utils'

import AddAppointmentBody from './AddAppointmentBody'
import EditableButtons from '../EditableButtons/EditableButtons'

export default function AddAppointmentModal({ selectedSlotInfo, isOpen, onClose }) {
  const [templateButtons, setTemplateButtons] = useState(getEventTemplateButtons())

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
      <ModalContent>
        <Tabs>
          <TabList>
            <Tab>Ajouter rendez-vous</Tab>
            <Tab onClick={() => setTemplateButtons(getEventTemplateButtons())}>modifier boutons</Tab>
          </TabList>

          <TabPanels>
            <TabPanel paddingBottom={0}>
              <AddAppointmentBody
                selectedSlotInfo={selectedSlotInfo}
                templateButtons={templateButtons}
                handleClose={onClose}
              />
            </TabPanel>
            <TabPanel paddingBottom={0}>
              <EditableButtons
                label="Mettre événement (btn modifiable)"
                handleClose={onClose}
                getTemplateButtons={getEventTemplateButtons}
                addTemplateButtons={addEventTemplateButtons}
                dropTemplateButton={dropEventTemplateButton}
              />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </ModalContent>
    </Modal>
  )
}
