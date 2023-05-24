import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { AlertCircle, CheckCircle } from 'react-feather'
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Input,
  Stack,
  useToast,
  InputGroup,
  InputLeftElement,
  Textarea,
} from '@chakra-ui/react'
import { format, parseISO } from 'date-fns'

import { CREATE_PATIENT_NAMES } from '../../config'
import { ChatState } from '../../context'
import { getPatient } from '../../utils'

import Loader from '../Loader/Loader'

export default function EditPatientModal({ isOpen, onClose, patientsList, setPatientsList }) {
  const { user } = ChatState()
  const toast = useToast()
  const {
    handleSubmit,
    control,
    reset,
    formState: { isSubmitted },
  } = useForm()

  const [patientAppointments, setPatientAppointments] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const onSubmit = async (data) => {
    setIsLoading(true)
    const response = await fetch(`/api/patients/${data._id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${user.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (response.status === 200) {
      const updatedPatient = await response.json()
      const updatedPatientList = patientsList.map((patient) =>
        updatedPatient._id === patient._id ? updatedPatient : patient,
      )
      setPatientsList(updatedPatientList)
      toast({
        title: 'le profil du patient a été mis à jour avec succès',
        status: 'success',
      })
      onClose()
    } else {
      toast()
    }
    setIsLoading(false)
  }

  useEffect(() => {
    const patient = getPatient()
    reset(patient)
    ;(async () => {
      setIsLoading(true)
      const response = await fetch(`/api/appointment/${patient._id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })

      if (response.status === 200) {
        setPatientAppointments(await response.json())
      }
      setIsLoading(false)
    })()
  }, [user, reset, isOpen])

  return (
    <Modal size="2xl" isOpen={isOpen} onClose={onClose}>
      <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
      <ModalContent>
        <ModalHeader>Modifier un patient</ModalHeader>
        <ModalCloseButton p="6" />
        <form className="create-profile-form" onSubmit={handleSubmit(onSubmit)}>
          <ModalBody>
            <Stack spacing={3}>
              <Controller
                control={control}
                name={CREATE_PATIENT_NAMES.FULL_NAME}
                shouldUnregister={isSubmitted}
                render={({ field: { onChange, value } }) => (
                  <InputGroup>
                    <InputLeftElement
                      pointerEvents="none"
                      children={
                        String(value).length >= 1 ? (
                          <CheckCircle size="1.25rem" color="green" />
                        ) : (
                          <AlertCircle size="1.25rem" color="red" />
                        )
                      }
                    />
                    <Input type="text" placeholder="nom et prénom" value={value} onChange={onChange} />
                  </InputGroup>
                )}
              />

              <Controller
                control={control}
                name={CREATE_PATIENT_NAMES.AGE}
                shouldUnregister={isSubmitted}
                render={({ field: { onChange, value } }) => (
                  <InputGroup>
                    <InputLeftElement
                      pointerEvents="none"
                      children={
                        String(value).length >= 1 ? (
                          <CheckCircle size="1.25rem" color="green" />
                        ) : (
                          <AlertCircle size="1.25rem" color="red" />
                        )
                      }
                    />
                    <Input type="number" placeholder="Age" value={value} onChange={onChange} />
                  </InputGroup>
                )}
              />

              <Controller
                control={control}
                name={CREATE_PATIENT_NAMES.PHONE_NUMBER}
                shouldUnregister={isSubmitted}
                render={({ field: { onChange, value } }) => (
                  <InputGroup>
                    <InputLeftElement
                      pointerEvents="none"
                      children={
                        String(value).length >= 1 ? (
                          <CheckCircle size="1.25rem" color="green" />
                        ) : (
                          <AlertCircle size="1.25rem" color="red" />
                        )
                      }
                    />
                    <Input type="tel" placeholder="numéro de téléphone" value={value} onChange={onChange} />
                  </InputGroup>
                )}
              />

              <Loader loading={isLoading}>
                <Stack
                  style={{
                    height: '20rem',
                    overflowY: 'auto',
                    border: '1px solid #ddd',
                    borderRadius: '0.25rem',
                  }}>
                  {patientAppointments.map((appointment) => {
                    const {
                      _id,
                      motif,
                      generalState,
                      diagnostic,
                      treatmentPlan,
                      title,
                      createdAt,
                      isNewTreatment,
                      isDone,
                      totalPrice,
                      payment,
                    } = appointment
                    const history =
                      `MOTIF: ${motif}\nETATE: ${generalState}\nDIAG: ${diagnostic}\nPLANT: ${treatmentPlan}\nTitre: ${title}`.trim()

                    return (
                      <Controller
                        key={_id}
                        control={control}
                        name={`${CREATE_PATIENT_NAMES.HISTORY}.${_id}`}
                        shouldUnregister={isSubmitted}
                        render={({ field: { onChange, value } }) => (
                          <InputGroup>
                            <div style={{ width: '6rem' }}>
                              {isNewTreatment && <hr />}
                              <div style={{ padding: '0 0.25rem', color: isNewTreatment ? 'blue' : 'gray' }}>
                                <span style={{ borderBottom: isNewTreatment ? '1px solid blue' : '' }}>
                                  {format(parseISO(createdAt), 'yy.MM.dd')}
                                </span>
                                {isNewTreatment && (
                                  <>
                                    <br />
                                    T: {totalPrice}
                                    <br />
                                    V: {payment}
                                    <br />
                                    {isDone ? 'F' : 'DF'}
                                  </>
                                )}
                              </div>
                            </div>
                            {isNewTreatment ? (
                              <Textarea
                                p="0.5"
                                pl="2"
                                height="24"
                                borderRadius="0"
                                borderLeft="0"
                                borderRight="0"
                                borderBottom="0"
                                placeholder="Historique"
                                defaultValue={history}
                                value={value}
                                onChange={onChange}
                              />
                            ) : (
                              <div>
                                Titre: {title} / V: {payment || '0'} / {isDone ? 'F' : 'DF'}
                              </div>
                            )}
                          </InputGroup>
                        )}
                      />
                    )
                  })}
                </Stack>
              </Loader>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button type="submit" colorScheme="blue" mr={3}>
              Modifier patient
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Annuler
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}
