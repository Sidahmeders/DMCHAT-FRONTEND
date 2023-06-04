import { useForm, Controller } from 'react-hook-form'
import { Textarea } from '@chakra-ui/react'
import { AlertCircle, CheckCircle } from 'react-feather'
import { Input, Stack, InputGroup, InputLeftElement, Grid, GridItem } from '@chakra-ui/react'

import { CREATE_PATIENT_NAMES } from '../../config'

export default function PatientEditBody({ patient }) {
  const {
    control,
    formState: { isSubmitted },
  } = useForm({ defaultValues: patient })

  return (
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
  )
}
