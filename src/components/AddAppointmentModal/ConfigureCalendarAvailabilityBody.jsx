import { useState } from 'react'
import { ModalBody, ModalFooter, Stack, RadioGroup, Radio, Button } from '@chakra-ui/react'

import { CALENDAR_DAY_AVAILABILITY } from '@config'
import { setCalendarAvailability } from '@services/calendar'

import Loader from '../Loader/Loader'

export default function ConfigureCalendarAvailabilityBody({ selectedSlotInfo, handleClose }) {
  const [availability, setAvailability] = useState(CALENDAR_DAY_AVAILABILITY.EMPTY)
  const [isLoading, setIsLoading] = useState(false)
  const { start, slots, action } = selectedSlotInfo

  const handleCalendarAvailability = async () => {
    setIsLoading(true)
    if (action === 'click') {
      await setCalendarAvailability(start, availability)
    } else if (action === 'select') {
      await slots.reduce(async (prevPromise, slot) => {
        await prevPromise
        await setCalendarAvailability(slot, availability)
      }, Promise.resolve())
    }
    setIsLoading(false)
    handleClose()
  }

  return (
    <Loader loading={isLoading}>
      <ModalBody>
        <Stack>
          <RadioGroup onChange={setAvailability} value={availability}>
            <Stack mt="2" spacing={6} direction="row">
              <Radio colorScheme="cyan" value={CALENDAR_DAY_AVAILABILITY.EMPTY}>
                jour vide
              </Radio>
              <Radio colorScheme="gray" value={CALENDAR_DAY_AVAILABILITY.REST}>
                jour de repos
              </Radio>
              <Radio colorScheme="yellow" value={CALENDAR_DAY_AVAILABILITY.BUSY}>
                jour occupée
              </Radio>
              <Radio colorScheme="red" value={CALENDAR_DAY_AVAILABILITY.LOADED}>
                jour chargée
              </Radio>
            </Stack>
          </RadioGroup>
        </Stack>
      </ModalBody>

      <ModalFooter pb="0">
        <Button type="submit" colorScheme="blue" mr={3} onClick={handleCalendarAvailability}>
          confirmer disponibilité
        </Button>
        <Button variant="ghost" onClick={handleClose}>
          Annuler
        </Button>
      </ModalFooter>
    </Loader>
  )
}
