import { Box, HStack } from '@chakra-ui/react'

import { ChatState } from '@context'
import { SUGGESTIONS_CONTAINER_DIRECTION } from '@config'

import SuggestionButton from '@components/miscellaneous/SuggestionButton'

const SuggestionBox = ({ suggestions, setNewMessage }) => {
  const { suggestionCheckboxes, suggestionContainerDirection, suggestionContainerHeight } = ChatState()

  if (!suggestionCheckboxes.showSuggestions) return null

  if (suggestionContainerDirection === SUGGESTIONS_CONTAINER_DIRECTION.column) {
    return (
      <Box
        height={suggestionContainerHeight}
        bg="white"
        overflow="auto"
        borderRadius="md"
        py={suggestions.length ? '1' : '0'}>
        {suggestions.map((suggestion, index) => (
          <SuggestionButton key={index} suggestion={suggestion} setNewMessage={setNewMessage} />
        ))}
      </Box>
    )
  }

  return (
    <Box
      height={suggestionContainerHeight}
      bg="white"
      overflow="auto"
      borderRadius="md"
      py={suggestions.length ? '1' : '0'}>
      <HStack width="fit-content">
        {suggestions.map((suggestion, index) => (
          <SuggestionButton key={index} suggestion={suggestion} setNewMessage={setNewMessage} />
        ))}
      </HStack>
    </Box>
  )
}

export default SuggestionBox
