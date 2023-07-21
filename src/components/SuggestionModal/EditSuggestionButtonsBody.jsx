import { ModalBody, Box } from '@chakra-ui/react'

import { SUGGESTIONS } from '@fakeDB'

import SuggestionButton from '@components/miscellaneous/SuggestionButton'

const EditSuggestionButtonsBody = () => {
  return (
    <ModalBody>
      <Box w="fit-content" h="35rem" overflowY="auto">
        {SUGGESTIONS.map((suggestion, index) => (
          <SuggestionButton key={index} suggestion={suggestion} />
        ))}
      </Box>
    </ModalBody>
  )
}

export default EditSuggestionButtonsBody
