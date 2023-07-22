import { useState } from 'react'
import { ModalBody, Box, FormControl, Button, Textarea } from '@chakra-ui/react'

import { ChatState } from '@context'
import { setChatTemplateButtons } from '@utils'

import SuggestionButton from '@components/miscellaneous/SuggestionButton'

const EditSuggestionButtonsBody = () => {
  const { suggestions, setSuggestions } = ChatState()
  const [chatSuggestion, setChatSuggestion] = useState('')

  const createNewChatSuggestion = () => {
    if (chatSuggestion.trim().length >= 3) {
      setChatTemplateButtons(chatSuggestion)
      setSuggestions([chatSuggestion, ...suggestions])
      setChatSuggestion('')
    }
  }

  return (
    <ModalBody>
      <FormControl>
        <Textarea
          placeholder="Suggestion (btn modifiable)"
          value={chatSuggestion}
          onChange={(e) => setChatSuggestion(e.target.value)}
        />
        <Button variant="solid" colorScheme="purple" width="100%" mt="2" onClick={createNewChatSuggestion}>
          Ajouter suggestion
        </Button>
      </FormControl>

      <Box w="fit-content" h="35rem" overflowY="auto" mt="3">
        {suggestions.map((suggestion, index) => (
          <SuggestionButton key={index} suggestion={suggestion} />
        ))}
      </Box>
    </ModalBody>
  )
}

export default EditSuggestionButtonsBody
