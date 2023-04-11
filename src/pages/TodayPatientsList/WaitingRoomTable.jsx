import { Draggable, Droppable } from 'react-beautiful-dnd'
import { Text, IconButton, Button, Box, Flex, Avatar, Heading } from '@chakra-ui/react'
import { Card, CardHeader, CardBody, CardFooter } from '@chakra-ui/card'
import { MoreVertical, CheckCircle, MessageCircle, Flag } from 'react-feather'

const DragWrap = ({ id, index, children }) => (
  <Draggable draggableId={id} index={index}>
    {(provided, snapshot) => (
      <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
        {children}
      </div>
    )}
  </Draggable>
)

export default function WaitingRoomTable({ patients }) {
  return (
    <Droppable droppableId="waiting-room" type="PATIENT">
      {(provided, snapshot) => (
        <div className="waiting-room-container" ref={provided.innerRef} {...provided.droppableProps}>
          <h1 className="title">Salle D'Attente</h1>
          {patients.map((item, index) => (
            <DragWrap key={item.id} id={item.id} index={index}>
              <Card maxW="sm" className="card-container">
                <CardHeader>
                  <Flex spacing="4">
                    <Flex flex="1" gap="4" alignItems="center" flexWrap="wrap">
                      <Avatar name={item.name} src="" />
                      <Box>
                        <Heading size="sm">
                          {item.name} / {item.age}
                        </Heading>
                        <Text>{item.motif}</Text>
                      </Box>
                    </Flex>
                    <IconButton variant="ghost" colorScheme="gray" aria-label="See menu" icon={<MoreVertical />} />
                  </Flex>
                </CardHeader>

                <CardBody className="card-body">
                  <p>Etate général: {item.state}</p>
                  <p>diagnostique: {item.diagnostic}</p>
                  <p>plan: {item.treatmentPlan}</p>
                  <p>historique: {item.history}</p>
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
            </DragWrap>
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  )
}
