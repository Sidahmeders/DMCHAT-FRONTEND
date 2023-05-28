import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { AlertCircle, CheckCircle, FileText, File, DollarSign } from 'react-feather'
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
  Textarea,
  InputGroup,
  InputLeftElement,
  Grid,
  GridItem,
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
  const [searchName, setSearchName] = useState('')
  const [isMounted, setIsMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isWaitingList, setIsWaitingList] = useState(false)
  const [isNewTreatment, setIsNewTreatment] = useState(false)

  const onSubmit = async (data) => {
    if (!user) return
    setIsLoading(true)
    const { fullName } = data
    const [patientId] = fullName.split('-')
    const { _id: userId } = user

    const response = await fetch('/api/appointment', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${user.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
        isNewTreatment,
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
          ...createdAppointment,
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
    if (!isMounted && searchName.trim().length >= 2) {
      ;(async () => {
        setIsMounted(true)
        try {
          const response = await fetch(`/api/patients/fullname/${searchName}`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          })

          if (response.status === 200) {
            setMatchedPatients(resolvePatientOptions(await response.json()))
          }
        } catch (error) {
          console.error(error.message)
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
                    if (value.length >= 2) {
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
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    children={
                      value?.length >= 2 ? (
                        <CheckCircle size="1.25rem" color="green" />
                      ) : (
                        <AlertCircle size="1.25rem" color="red" />
                      )
                    }
                  />
                  <Input type="text" placeholder="Mettre rendez-vous" value={value} onChange={(val) => onChange(val)} />
                </InputGroup>
              )}
            />

            {!isNewTreatment && (
              <Controller
                control={control}
                name={ADD_APPOINTMENT_NAME.PAYMENT}
                shouldUnregister={isSubmitted}
                render={({ field: { onChange, value } }) => (
                  <InputGroup>
                    <InputLeftElement pointerEvents="none" children={<DollarSign size="1.25rem" color="gray" />} />
                    <Input
                      type="number"
                      min={0}
                      step={1000}
                      placeholder="versement"
                      value={value}
                      onChange={onChange}
                    />
                  </InputGroup>
                )}
              />
            )}

            <FormControl display="flex" alignItems="center">
              <FormLabel htmlFor="new-treatment" ml="1" mb="0">
                Nouvelle traitement?
              </FormLabel>
              <Switch
                id="new-treatment"
                colorScheme="red"
                checked={isNewTreatment}
                onChange={() => setIsNewTreatment(!isNewTreatment)}
              />
            </FormControl>

            {isNewTreatment && (
              <>
                <Controller
                  control={control}
                  name={ADD_APPOINTMENT_NAME.MOTIF}
                  shouldUnregister={isSubmitted}
                  render={({ field: { onChange, value } }) => (
                    <InputGroup>
                      <InputLeftElement
                        pointerEvents="none"
                        children={
                          value?.length >= 2 ? (
                            <CheckCircle size="1.25rem" color="green" />
                          ) : (
                            <AlertCircle size="1.25rem" color="red" />
                          )
                        }
                      />
                      <Input type="text" placeholder="Motif de consultation" value={value} onChange={onChange} />
                    </InputGroup>
                  )}
                />

                <Controller
                  control={control}
                  name={ADD_APPOINTMENT_NAME.GENERAL_STATE}
                  shouldUnregister={isSubmitted}
                  render={({ field: { onChange, value } }) => (
                    <InputGroup>
                      <InputLeftElement
                        pointerEvents="none"
                        children={
                          value?.length >= 2 ? (
                            <CheckCircle size="1.25rem" color="green" />
                          ) : (
                            <AlertCircle size="1.25rem" color="red" />
                          )
                        }
                      />
                      <Input type="text" placeholder="Etate général" value={value} onChange={onChange} />
                    </InputGroup>
                  )}
                />

                <Controller
                  control={control}
                  name={ADD_APPOINTMENT_NAME.DIAGNOSTIC}
                  shouldUnregister={isSubmitted}
                  render={({ field: { onChange, value } }) => (
                    <InputGroup>
                      <InputLeftElement pointerEvents="none" children={<File size="1.25rem" color="gray" />} />
                      <Input type="text" placeholder="Diagnostique" value={value} onChange={onChange} />
                    </InputGroup>
                  )}
                />

                <Controller
                  control={control}
                  name={ADD_APPOINTMENT_NAME.TREATMENT_PLAN}
                  shouldUnregister={isSubmitted}
                  render={({ field: { onChange, value } }) => (
                    <InputGroup>
                      <InputLeftElement pointerEvents="none" children={<FileText size="1.25rem" color="gray" />} />
                      <Textarea pl="10" placeholder="Plan de traitement" value={value} onChange={onChange} />
                    </InputGroup>
                  )}
                />

                <Grid templateColumns="repeat(2, 1fr)" gap="2">
                  <GridItem>
                    <Controller
                      control={control}
                      name={ADD_APPOINTMENT_NAME.TOTAL_PRICE}
                      shouldUnregister={isSubmitted}
                      render={({ field: { onChange, value } }) => (
                        <InputGroup>
                          <InputLeftElement
                            pointerEvents="none"
                            children={<DollarSign size="1.25rem" color={value >= 1000 ? 'green' : 'red'} />}
                          />
                          <Input
                            type="number"
                            min={0}
                            step={1000}
                            placeholder="Prix total"
                            value={value}
                            onChange={onChange}
                          />
                        </InputGroup>
                      )}
                    />
                  </GridItem>
                  <GridItem>
                    <Controller
                      control={control}
                      name={ADD_APPOINTMENT_NAME.PAYMENT}
                      shouldUnregister={isSubmitted}
                      render={({ field: { onChange, value } }) => (
                        <InputGroup>
                          <InputLeftElement
                            pointerEvents="none"
                            children={<DollarSign size="1.25rem" color="gray" />}
                          />
                          <Input
                            type="number"
                            min={0}
                            step={1000}
                            placeholder="versement"
                            value={value}
                            onChange={onChange}
                          />
                        </InputGroup>
                      )}
                    />
                  </GridItem>
                </Grid>
              </>
            )}

            <FormControl display="flex" alignItems="center">
              <FormLabel htmlFor="awaiting-list" ml="1" mb="0">
                Ajouter à la liste d'attente?
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
