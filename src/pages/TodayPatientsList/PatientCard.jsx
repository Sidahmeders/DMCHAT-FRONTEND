import { Text, IconButton, Button, Box, Flex, Avatar, Heading } from '@chakra-ui/react'
import { Card, CardHeader, CardBody, CardFooter } from '@chakra-ui/card'
import { MoreVertical, CheckCircle, MessageCircle, Flag } from 'react-feather'

export default function PatientCard({ patient }) {
  return (
    <Card maxW="sm" className="card-container">
      <CardHeader>
        <Flex spacing="4">
          <Flex flex="1" gap="4" alignItems="center" flexWrap="wrap">
            <Avatar name={patient.name} src="" />
            <Box>
              <Heading size="sm">
                {patient.name} / {patient.age}
              </Heading>
              <Text>{patient.motif}</Text>
            </Box>
          </Flex>
          <IconButton variant="ghost" colorScheme="gray" aria-label="See menu" icon={<MoreVertical />} />
        </Flex>
      </CardHeader>

      <CardBody className="card-body">
        <p>Etate général: {patient.state}</p>
        <p>diagnostique: {patient.diagnostic}</p>
        <p>plan: {patient.treatmentPlan}</p>
        <p>historique: {patient.history}</p>
      </CardBody>

      <CardFooter justify="space-between" flexWrap="wrap">
        <Button flex="1" variant="ghost" leftIcon={<CheckCircle />}>
          confirmer
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
