import { ModalBody, ModalFooter, Stack, RadioGroup, Radio, Button } from '@chakra-ui/react'
import { useState } from 'react'

export default function ConfigureCalendarAvailability({ handleClose }) {
  const [value, setValue] = useState('1')

  return (
    <>
      <ModalBody>
        <Stack>
          <RadioGroup onChange={setValue} value={value}>
            <Stack spacing={6} direction="row">
              <Radio colorScheme="red" value="1">
                journée chargée
              </Radio>
              <Radio colorScheme="yellow" value="2">
                journée occupée
              </Radio>
            </Stack>
            <Stack mt="2" spacing={6} direction="row">
              <Radio colorScheme="green" value="3">
                journée vide
              </Radio>
              <Radio colorScheme="purple" value="4">
                jour de repos
              </Radio>
            </Stack>
          </RadioGroup>
        </Stack>
      </ModalBody>

      <ModalFooter pb="0">
        <Button type="submit" colorScheme="blue" mr={3}>
          confirmer disponibilité
        </Button>
        <Button variant="ghost" onClick={handleClose}>
          Annuler
        </Button>
      </ModalFooter>
    </>
  )
}
