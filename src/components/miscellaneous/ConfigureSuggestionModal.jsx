import { useEffect } from 'react'
import {
  IconButton,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Box,
  Stack,
  Checkbox,
  RadioGroup,
  Radio,
  FormLabel,
  ModalCloseButton,
} from '@chakra-ui/react'
import { Tool } from 'react-feather'

import { ChatState } from '@context'
import { SUGGESTIONS_CONTAINER_DIRECTION, SUGGESTIONS_CONTAINER_HEIGHTS } from '@config'

const ConfigureSuggestionModal = ({ isOpen, onOpen, onClose }) => {
  const {
    suggestionCheckboxes,
    setSuggestionCheckboxes,
    suggestionContainerDirection,
    setSuggestionContainerDirection,
    suggestionContainerHeight,
    setSuggestionContainerHeight,
  } = ChatState()

  useEffect(() => {
    if (suggestionContainerDirection === SUGGESTIONS_CONTAINER_DIRECTION.row) {
      setSuggestionContainerHeight(SUGGESTIONS_CONTAINER_HEIGHTS.small)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [suggestionContainerDirection])

  return (
    <>
      <IconButton width="fit-content" _hover={{ bg: 'purple.100' }} onClick={onOpen} icon={<Tool color="#8c00ff" />} />

      <Modal size="lg" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader>Modifier les paramètres de suggestion</ModalHeader>
          <ModalBody pb="6">
            <Box>
              <Checkbox
                isChecked={suggestionCheckboxes.showSuggestions}
                isIndeterminate={suggestionCheckboxes.showSuggestions}
                onChange={(e) =>
                  setSuggestionCheckboxes({
                    ...suggestionCheckboxes,
                    showSuggestions: e.target.checked,
                  })
                }>
                Afficher la boîte de suggestion
              </Checkbox>
              <Stack pl={6} mt={1} spacing={1}>
                <Checkbox
                  isChecked={suggestionCheckboxes.filterSuggestions}
                  onChange={(e) =>
                    setSuggestionCheckboxes({
                      ...suggestionCheckboxes,
                      filterSuggestions: e.target.checked,
                    })
                  }>
                  Filtrer les suggestions lors de la saisie
                </Checkbox>
                <Checkbox
                  isChecked={suggestionCheckboxes.useMultipleSuggestions}
                  onChange={(e) =>
                    setSuggestionCheckboxes({
                      ...suggestionCheckboxes,
                      useMultipleSuggestions: e.target.checked,
                    })
                  }>
                  Utiliser plusieurs suggestions à la fois
                </Checkbox>
              </Stack>
            </Box>

            <Stack mt="3">
              <FormLabel m="0">sens de défilement des suggestions</FormLabel>
              <RadioGroup
                colorScheme="blue"
                onChange={setSuggestionContainerDirection}
                defaultValue={suggestionContainerDirection}>
                <Stack spacing={4} direction="row">
                  <Radio value={SUGGESTIONS_CONTAINER_DIRECTION.row}>défilement horizontal</Radio>
                  <Radio value={SUGGESTIONS_CONTAINER_DIRECTION.column}>défilement vertical</Radio>
                </Stack>
              </RadioGroup>
            </Stack>

            {suggestionContainerDirection === SUGGESTIONS_CONTAINER_DIRECTION.column && (
              <Stack mt="3">
                <FormLabel m="0">Hauteur du conteneur (boîte) de suggestions</FormLabel>
                <RadioGroup
                  colorScheme="blue"
                  defaultValue={suggestionContainerHeight}
                  onChange={setSuggestionContainerHeight}>
                  <Stack spacing={4} direction="row">
                    <Radio value={SUGGESTIONS_CONTAINER_HEIGHTS.small}>
                      petit ({SUGGESTIONS_CONTAINER_HEIGHTS.small})
                    </Radio>
                    <Radio value={SUGGESTIONS_CONTAINER_HEIGHTS.medium}>
                      moyen ({SUGGESTIONS_CONTAINER_HEIGHTS.medium})
                    </Radio>
                    <Radio value={SUGGESTIONS_CONTAINER_HEIGHTS.large}>
                      grand ({SUGGESTIONS_CONTAINER_HEIGHTS.large})
                    </Radio>
                  </Stack>
                </RadioGroup>
              </Stack>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default ConfigureSuggestionModal
