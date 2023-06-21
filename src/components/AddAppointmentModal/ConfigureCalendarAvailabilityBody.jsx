import { useState } from 'react'
import { ModalBody, ModalFooter, Stack, RadioGroup, Radio, Button } from '@chakra-ui/react'
import { format } from 'date-fns'

import { ChatState } from '@context'
import { CALENDAR_DAY_AVAILABILITY } from '@config'

import Loader from '../Loader/Loader'

export default function ConfigureCalendarAvailabilityBody({ selectedSlotInfo, handleClose }) {
  const [availability, setAvailability] = useState(CALENDAR_DAY_AVAILABILITY.EMPTY)
  const [isLoading, setIsLoading] = useState(false)
  const { start, slots, action } = selectedSlotInfo
  const { user } = ChatState()

  const updateDayAvailability = async (date) => {
    const response = await fetch(`/api/calendar/${format(date, 'yyyy/MM/dd')}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({ availability }),
    })
    return await response.json()
  }

  const handleCalendarAvailability = async () => {
    setIsLoading(true)

    if (action === 'click') {
      await updateDayAvailability(start)
    } else if (action === 'select') {
      await slots.reduce(async (prevPromise, slot) => {
        await prevPromise
        await updateDayAvailability(slot)
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
