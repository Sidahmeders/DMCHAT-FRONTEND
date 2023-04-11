import { Text, IconButton, Button, Box, Flex, Avatar, Heading } from '@chakra-ui/react'
import { Card, CardHeader, CardBody, CardFooter } from '@chakra-ui/card'
import { ChevronDown, ChevronUp, CheckCircle, MessageCircle, Flag } from 'react-feather'
import { useState } from 'react'

export default function PatientCard({ patient }) {
  const [showCardBody, setShowCardBody] = useState(false)

  return (
    <Card maxW="sm" className="card-container">
      <CardHeader marginBottom="2">
        <Flex spacing="4">
          <Flex flex="1" gap="4" alignItems="center" flexWrap="wrap">
            <Avatar name={patient.name} src="" />
            <Box>
              <Heading size="sm">
                {patient.name} - {patient.age}
              </Heading>
              <Text padding="0.5">{patient.motif}</Text>
            </Box>
          </Flex>
          <IconButton
            variant="ghost"
            colorScheme="gray"
            aria-label="See menu"
            icon={showCardBody ? <ChevronUp /> : <ChevronDown />}
            onClick={() => setShowCardBody(!showCardBody)}
          />
        </Flex>
      </CardHeader>

      {showCardBody && (
        <CardBody padding="0 0.25rem">
          <p>Etate général: {patient.state}</p>
          <p>diagnostique: {patient.diagnostic}</p>
          <p>plan: {patient.treatmentPlan}</p>
          <p>historique: {patient.history}</p>
        </CardBody>
      )}

      <CardFooter justify="space-between" flexWrap="wrap" paddingTop="2">
        <Button flex="1" variant="ghost" leftIcon={<CheckCircle />}>
          confirm.
        </Button>
        <Button flex="1" variant="ghost" leftIcon={<Flag />}>
          parti
        </Button>
        <Button flex="1" variant="ghost" leftIcon={<MessageCircle />}>
          avis
        </Button>
      </CardFooter>
    </Card>
  )
}
