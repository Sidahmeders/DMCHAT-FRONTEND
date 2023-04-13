import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { ModalBody, ModalFooter, Button, Input, Stack } from '@chakra-ui/react'
import Select from 'react-select'

import { CREATE_PATIENT_NAMES } from '../../config'
import { ChatState } from '../../context'

const resolvePatientOptions = (patients) => {
  return patients.map(({ _id, fullName, age }) => ({
    label: `${fullName} ${age}`,
    value: _id,
  }))
}

export default function AddAppointmentBody({ selectedSlotInfo, templateButtons, handleClose }) {
  const { user } = ChatState()

  const {
    handleSubmit,
    control,
    reset,
    formState: { isSubmitted },
  } = useForm()

  const [matchedPatients, setMatchedPatients] = useState([])
  const [searchName, setSearchName] = useState('@')
  const [isMounted, setIsMounted] = useState(false)

  const onSubmit = () => handleClose()

  useEffect(() => {
    reset({})
  }, [isSubmitted, reset])

  useEffect(() => {
    if (!isMounted) {
      ;(async () => {
        setIsMounted(true)
        try {
          const response = await fetch(`/api/patient/${searchName}`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          })
          const patientData = await response.json()
          setMatchedPatients(resolvePatientOptions(patientData))
        } catch (error) {
          console.log(error.message)
        }
        setIsMounted(false)
      })()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchName])

  return (
    <>
      <ModalBody>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={4}>
            <Controller
              control={control}
              name={CREATE_PATIENT_NAMES.FULL_NAME}
              rules={{ required: true }}
              shouldUnregister={isSubmitted}
              render={({ field: { onChange, value } }) => (
                <Select
                  placeholder="Nom du patient..."
                  options={matchedPatients}
                  value={matchedPatients.find((option) => option.value === value)}
                  onChange={(val) => onChange(val.value)}
                  onKeyDown={(e) => {
                    const { value } = e.target
                    if (value.trim().length >= 2) {
                      setSearchName(value)
                    }
                  }}
                />
              )}
            />

            <Input type="text" placeholder="Mettre rendez-vous" />
          </Stack>
        </form>
      </ModalBody>
      <ModalFooter>
        <Button type="submit" colorScheme="blue" mr={3}>
          Ajouter rendez-vous
        </Button>
        <Button variant="ghost" onClick={handleClose}>
          Annuler
        </Button>
      </ModalFooter>
    </>
  )
}
