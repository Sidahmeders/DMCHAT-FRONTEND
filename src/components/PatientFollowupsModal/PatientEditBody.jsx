import { useForm, Controller } from 'react-hook-form'
import { AlertCircle, CheckCircle } from 'react-feather'
import { HStack, Button, Textarea, Input, Stack, InputGroup, InputLeftElement, Grid, GridItem } from '@chakra-ui/react'

import { CREATE_PATIENT_NAMES } from '@config'

export default function PatientEditBody({ patient, setIsEditPatientOpen }) {
  const {
    handleSubmit,
    control,
    formState: { isSubmitted },
  } = useForm({ defaultValues: patient })

  const onSubmit = (data) => {}

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3} mt="4">
        <Grid templateColumns="repeat(10, 1fr)" gap="2">
          <GridItem colSpan="5">
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
          </GridItem>

          <GridItem colSpan="2">
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
                  <Input type="number" min={1} max={120} placeholder="Age" value={value} onChange={onChange} />
                </InputGroup>
              )}
            />
          </GridItem>
          <GridItem colSpan="3">
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
          </GridItem>
        </Grid>

        <Controller
          control={control}
          name={CREATE_PATIENT_NAMES.GENERAL_STATE}
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
              <Textarea pl="10" placeholder="Etate général" value={value} onChange={onChange} />
            </InputGroup>
          )}
        />
      </Stack>
      <HStack mt="4">
        <Button type="submit" colorScheme="orange" mr={3}>
          Sauvegarder patient
        </Button>
        <Button variant="ghost" onClick={() => setIsEditPatientOpen(false)}>
          Annuler
        </Button>
      </HStack>
    </form>
  )
}
