import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import {
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Stack,
  useToast,
  FormControl,
  FormLabel,
  Switch,
} from '@chakra-ui/react'
import Select from 'react-select'

import { ADD_APPOINTMENT_NAME } from '../../config'
import { ChatState } from '../../context'

import Loader from '../Loader/Loader'

const resolvePatientOptions = (patients) => {
  return patients.map(({ _id, fullName, age }) => ({
    label: `${fullName} ${age}`,
    value: `${_id}-${fullName}`,
  }))
}

const initialValues = Object.values(ADD_APPOINTMENT_NAME).reduce((prev, curr) => ({ ...prev, [curr]: '' }), {})

export default function AddAppointmentBody({ selectedSlotInfo, handleClose, events, setEvents }) {
  const { user } = ChatState()
  const toast = useToast()
  const { start, end } = selectedSlotInfo

  const {
    handleSubmit,
    control,
    reset,
    formState: { isSubmitted },
  } = useForm({ defaultValues: initialValues })

  const [matchedPatients, setMatchedPatients] = useState([])
  const [searchName, setSearchName] = useState('@')
  const [isMounted, setIsMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isWaitingList, setIsWaitingList] = useState(false)

  const onSubmit = async (data) => {
    if (!user) return
    setIsLoading(true)
    const { fullName, title } = data
    const [patientId] = fullName.split('-')
    const { _id: userId } = user

    const response = await fetch('/api/appointment', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${user.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        isWaitingList,
        sender: userId,
        patient: patientId,
        startDate: start,
        endDate: end,
      }),
    })

    if (response.status === 200) {
      const createdAppointment = await response.json()
      setEvents([
        ...events,
        {
          id: createdAppointment._id,
          title: createdAppointment.title,
          start: new Date(createdAppointment.startDate),
          end: new Date(createdAppointment.endDate),
        },
      ])
      toast({
        title: 'nouveau rendez-vous créé avec succès',
        status: 'success',
      })
    } else {
      toast()
    }

    handleClose()
    setIsLoading(false)
  }

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

          if (response.status === 200) {
            setMatchedPatients(resolvePatientOptions(await response.json()))
          }
        } catch (error) {
          console.log(error.message)
        }
        setIsMounted(false)
      })()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchName])

  return (
    <Loader loading={isLoading}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalBody>
          <Stack spacing={4}>
            <Controller
              control={control}
              name={ADD_APPOINTMENT_NAME.FULL_NAME}
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

            <Controller
              control={control}
              name={ADD_APPOINTMENT_NAME.TITLE}
              rules={{ required: true }}
              shouldUnregister={isSubmitted}
              render={({ field: { onChange, value } }) => (
                <Input type="text" placeholder="Mettre rendez-vous" value={value} onChange={(val) => onChange(val)} />
              )}
            />

            <FormControl display="flex" alignItems="center">
              <FormLabel htmlFor="awaiting-list" ml="1" mb="0">
                Ajouter à la liste d'attente
              </FormLabel>
              <Switch
                id="awaiting-list"
                colorScheme="orange"
                checked={isWaitingList}
                onChange={() => setIsWaitingList(!isWaitingList)}
              />
            </FormControl>
          </Stack>
        </ModalBody>
        <ModalFooter pb="0">
          <Button type="submit" colorScheme="blue" mr={3}>
            Ajouter rendez-vous
          </Button>
          <Button variant="ghost" onClick={handleClose}>
            Annuler
          </Button>
        </ModalFooter>
      </form>
    </Loader>
  )
}
