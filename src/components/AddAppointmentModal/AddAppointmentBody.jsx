import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { AlertCircle, CheckCircle, FileMinus, FilePlus, DollarSign } from 'react-feather'
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
  HStack,
} from '@chakra-ui/react'
import Select from 'react-select'

import { ChatState } from '@context'
import { CREATE_APPOINTMENT_NAMES } from '@config'
import { getMotifTemplateButtons } from '@utils'
import { createAppointment, relateAppointment } from '@services/appointments'
import { fetchPatients } from '@services/patients'

import Loader from '@components/Loader/Loader'
import PatientHistory from './PatientHistory'

const resolvePatientOptions = (patients) => {
  return patients.map(({ _id, fullName, age }) => ({
    label: `${fullName} ${age}`,
    value: `${_id}-${fullName}`,
  }))
}

export default function AddAppointmentBody({ selectedSlotInfo, handleClose, events, setEvents }) {
  const { user } = ChatState()
  const toast = useToast()
  const { start, end } = selectedSlotInfo
  const motifRadioOptions = getMotifTemplateButtons()
  const { handleSubmit, control, reset, getValues } = useForm()

  const [matchedPatients, setMatchedPatients] = useState([])
  const [patientOptions, setPatientOptions] = useState([])
  const [selectedPatient, setSelectedPatient] = useState({})
  const [searchName, setSearchName] = useState('')
  const [isMounted, setIsMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isNewTreatment, setIsNewTreatment] = useState(false)
  const [radioValue, setRadioValue] = useState('')
  const [baseAppointmentRadioValue, setBaseAppointmentRadioValue] = useState()

  const submitAppointment = async (data) => {
    if (!user) return
    setIsLoading(true)

    try {
      const { fullName } = data
      const [patientId] = fullName.split('-')
      const { _id: userId } = user

      let createdAppointment

      if (isNewTreatment) {
        createdAppointment = await createAppointment({
          ...data,
          [CREATE_APPOINTMENT_NAMES.SENDER]: userId,
          [CREATE_APPOINTMENT_NAMES.PATIENT]: patientId,
          [CREATE_APPOINTMENT_NAMES.START_DATE]: start,
          [CREATE_APPOINTMENT_NAMES.END_DATE]: end,
        })
      } else {
        createdAppointment = await relateAppointment({
          ...data,
          [CREATE_APPOINTMENT_NAMES.SENDER]: userId,
          [CREATE_APPOINTMENT_NAMES.PATIENT]: patientId,
          [CREATE_APPOINTMENT_NAMES.BASE_APPOINTMENT_ID]: baseAppointmentRadioValue,
          [CREATE_APPOINTMENT_NAMES.START_DATE]: start,
          [CREATE_APPOINTMENT_NAMES.END_DATE]: end,
        })
      }

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
      handleClose()
    } catch (error) {
      toast({ description: error.message })
    }
    reset({})
    setIsLoading(false)
  }

  const onError = () => {
    toast({
      title: 'erreur de validation',
      description: 'Veuillez remplir tous les champs obligatoires',
    })
  }

  useEffect(() => {
    if (!isMounted && searchName.trim().length >= 2) {
      ;(async () => {
        setIsMounted(true)
        try {
          const { patients } = await fetchPatients({ searchName })
          setMatchedPatients(patients)
          setPatientOptions(resolvePatientOptions(patients))
        } catch (error) {
          toast()
        }
        setIsMounted(false)
      })()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchName])

  return (
    <Loader loading={isLoading}>
      <form onSubmit={handleSubmit(submitAppointment, onError)}>
        <ModalBody>
          <Stack spacing={4}>
            <Controller
              control={control}
              name={CREATE_APPOINTMENT_NAMES.FULL_NAME}
              rules={{ required: true }}
              defaultValue=""
              render={({ field: { onChange, value } }) => (
                <Select
                  placeholder="Nom du patient..."
                  options={patientOptions}
                  value={patientOptions.find((option) => option.value === value)}
                  onChange={(option) => {
                    const { value } = option
                    const [patientId] = value.split('-')
                    onChange(value)
                    setSelectedPatient(matchedPatients.find((patient) => patient._id === patientId))
                  }}
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
              name={CREATE_APPOINTMENT_NAMES.MOTIF}
              rules={{ required: true }}
              defaultValue=""
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

            <HStack>
              {motifRadioOptions.map((option) => (
                <Button
                  colorScheme={radioValue?.id === option.id ? 'messenger' : 'gray'}
                  onClick={() => {
                    setRadioValue(option)
                    reset({
                      ...getValues(),
                      [CREATE_APPOINTMENT_NAMES.MOTIF]: option.name,
                    })
                  }}
                  key={option.id}
                  size="sm">
                  {option.name}
                </Button>
              ))}
            </HStack>

            <Controller
              control={control}
              name={CREATE_APPOINTMENT_NAMES.TITLE}
              defaultValue=""
              rules={{ required: true }}
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
                  <Input
                    type="text"
                    placeholder="Acte du rendez-vous"
                    value={value}
                    onChange={(val) => onChange(val)}
                  />
                </InputGroup>
              )}
            />

            <PatientHistory
              show={!isNewTreatment}
              patient={selectedPatient}
              baseAppointmentRadioValue={baseAppointmentRadioValue}
              setBaseAppointmentRadioValue={setBaseAppointmentRadioValue}
            />

            {!isNewTreatment && (
              <Controller
                control={control}
                name={CREATE_APPOINTMENT_NAMES.PAYMENT}
                defaultValue={0}
                render={({ field: { onChange, value } }) => (
                  <InputGroup>
                    <InputLeftElement pointerEvents="none" children={<DollarSign size="1.25rem" color="gray" />} />
                    <Input type="number" min={0} step={500} placeholder="versement" value={value} onChange={onChange} />
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
                  name={CREATE_APPOINTMENT_NAMES.DIAGNOSTIC}
                  defaultValue=""
                  render={({ field: { onChange, value } }) => (
                    <InputGroup>
                      <InputLeftElement pointerEvents="none" children={<FileMinus size="1.25rem" color="gray" />} />
                      <Textarea pl="10" placeholder="Diagnostique" value={value} onChange={onChange} />
                    </InputGroup>
                  )}
                />

                <Controller
                  control={control}
                  name={CREATE_APPOINTMENT_NAMES.TREATMENT_PLAN}
                  defaultValue=""
                  render={({ field: { onChange, value } }) => (
                    <InputGroup>
                      <InputLeftElement pointerEvents="none" children={<FilePlus size="1.25rem" color="gray" />} />
                      <Textarea pl="10" placeholder="Plan de traitement" value={value} onChange={onChange} />
                    </InputGroup>
                  )}
                />

                <Grid templateColumns="repeat(2, 1fr)" gap="2">
                  <GridItem>
                    <Controller
                      control={control}
                      name={CREATE_APPOINTMENT_NAMES.TOTAL_PRICE}
                      defaultValue={0}
                      render={({ field: { onChange, value } }) => (
                        <InputGroup>
                          <InputLeftElement
                            pointerEvents="none"
                            children={<DollarSign size="1.25rem" color={value >= 1000 ? 'green' : 'red'} />}
                          />
                          <Input
                            type="number"
                            min={0}
                            step={500}
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
                      name={CREATE_APPOINTMENT_NAMES.PAYMENT}
                      defaultValue={0}
                      render={({ field: { onChange, value } }) => (
                        <InputGroup>
                          <InputLeftElement
                            pointerEvents="none"
                            children={<DollarSign size="1.25rem" color="gray" />}
                          />
                          <Input
                            type="number"
                            min={0}
                            step={500}
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
