import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { ModalBody, ModalFooter, Button, Input, Stack } from '@chakra-ui/react'
import Select from 'react-select'

export default function AddAppointmentBody({ selectedSlotInfo, templateButtons, handleClose }) {
  const {
    handleSubmit,
    control,
    reset,
    formState: { isSubmitted },
  } = useForm()

  const onSubmit = () => handleClose()

  useEffect(() => {
    reset({})
  }, [isSubmitted, reset])

  return (
    <>
      <ModalBody>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={4}>
            <Controller
              control={control}
              name="XX_XX"
              rules={{ required: true }}
              shouldUnregister={isSubmitted}
              render={({ field: { onChange, value, ref } }) => (
                <Select
                  inputRef={ref}
                  placeholder="Nom du patient..."
                  options={[]}
                  value={[].find((option) => option.value === value)}
                  onChange={(val) => onChange(val.value)}
                />
              )}
            />

            <Input type="text" placeholder="Mettre événement" />
          </Stack>
        </form>
      </ModalBody>
      <ModalFooter>
        <Button colorScheme="blue" mr={3} onClick={() => {}}>
          Ajouter rendez-vous
        </Button>
        <Button variant="ghost" onClick={handleClose}>
          Annuler
        </Button>
      </ModalFooter>
    </>
  )
}
