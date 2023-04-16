import { Text, IconButton, Button, Box, Flex, Avatar, Heading } from '@chakra-ui/react'
import { Card, CardHeader, CardBody, CardFooter } from '@chakra-ui/card'
import { ChevronDown, ChevronUp, CheckCircle, MessageCircle, Flag } from 'react-feather'
import { useState } from 'react'

export default function PatientCard({ patient }) {
  const [showCardBody, setShowCardBody] = useState(false)
  const [isConfirmed, setIsConfirmed] = useState(false)
  const [isLeft, setIsLeft] = useState(false)

  return (
    <Card className={`card-container ${isConfirmed && 'confirmed'} ${isLeft && 'left'}`}>
      <CardHeader mb="0" padding="0.5rem">
        <Flex spacing="4">
          <Flex flex="1" gap="4" alignItems="center" flexWrap="wrap">
            <Avatar name={patient.fullName} src="" />
            <Box>
              <Heading size="sm">
                {patient.fullName} | {patient.age}
              </Heading>
              <Text padding="0.5">{patient.title}</Text>
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
        <CardBody padding="0 1.5rem">
          <p>motif: {patient.motif}</p>
          <p>Etate général: {patient.state}</p>
          <p>diagnostique: {patient.diagnostic}</p>
          <p>plan: {patient.treatmentPlan}</p>
          <p>historique: {patient.history}</p>
        </CardBody>
      )}

      <CardFooter justify="space-between" flexWrap="wrap" padding="0.5rem">
        <Button flex="4" variant="ghost" leftIcon={<CheckCircle />} onClick={() => setIsConfirmed(!isConfirmed)}>
          confirmer
        </Button>

        <Button flex="3" variant="ghost" leftIcon={<Flag />} onClick={() => setIsLeft(!isLeft)}>
          parti
        </Button>

        <Button flex="2" variant="ghost" pr="2" colorScheme="messenger" leftIcon={<MessageCircle />}></Button>
      </CardFooter>
    </Card>
  )
}
