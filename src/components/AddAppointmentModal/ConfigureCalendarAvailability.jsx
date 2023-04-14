import { useState } from 'react'
import { ModalBody, ModalFooter, Stack, RadioGroup, Radio, Button } from '@chakra-ui/react'
import { format } from 'date-fns'

import { ChatState } from '../../context'

import Loader from '../Loader/Loader'

const DAY_ENUM = {
  REST: 'REST',
  EMPTY: 'EMPTY',
  BUSY: 'BUSY',
  LOADED: 'LOADED',
}

export default function ConfigureCalendarAvailability({ selectedSlotInfo, events, setEvents, handleClose }) {
  const [availability, setAvailability] = useState(DAY_ENUM.EMPTY)
  const [isLoading, setIsLoading] = useState(false)
  const { start, slots, action } = selectedSlotInfo
  const { user } = ChatState()

  const updateDayAvailability = async date => {
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
    const newEvents = []

    if (action === 'click') {
      const newEvent = await updateDayAvailability(start)
      newEvents.push(newEvent)
    } else if (action === 'select') {
      await slots.reduce(async (prevPromise, slot) => {
        await prevPromise
        const newEvent = await updateDayAvailability(slot)
        newEvents.push(newEvent)
      }, Promise.resolve())

      setEvents([...events, ...newEvents])
    }
    setIsLoading(false)
    handleClose()
  }

  return (
    <Loader loading={isLoading}>
      <ModalBody>
        <Stack>
          <RadioGroup onChange={setAvailability} value={availability}>
            <Stack spacing={6} direction="row">
              <Radio colorScheme="purple" value={DAY_ENUM.REST}>
                jour de repos
              </Radio>
              <Radio colorScheme="green" value={DAY_ENUM.EMPTY}>
                journée vide
              </Radio>
            </Stack>
            <Stack mt="2" spacing={6} direction="row">
              <Radio colorScheme="yellow" value={DAY_ENUM.BUSY}>
                journée occupée
              </Radio>
              <Radio colorScheme="red" value={DAY_ENUM.LOADED}>
                journée chargée
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
