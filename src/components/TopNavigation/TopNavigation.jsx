import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Cast, Calendar, PieChart } from 'react-feather'
import { getPageRoute, setPageRoute } from '@utils'
import { APP_ROUTES } from '@config'
import ChatNotification from '../miscellaneous/ChatNotification'
import PatientListModal from '../PatientsListModal/PatientsListModal'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import './TopNavigation.scss'

export default function TopNavigation() {
  const location = useLocation()
  const [selectedRoute, setSelectedRoute] = useState(getPageRoute())
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)

  useEffect(() => {
    setSelectedRoute(getPageRoute())
  }, [location.pathname])

  const handleDragStart = () => {
    setIsDragging(true)
  }

  const handleDragEnd = (result) => {
    setIsDragging(false)
    if (!result.destination) {
      return
    }
  }

  const handleMouseMove = (event) => {
    if (isDragging) {
      setPosition((prevPosition) => ({
        x: prevPosition.x + event.movementX,
        y: prevPosition.y + event.movementY,
      }))
    }
  }

  const handleMouseDown = () => {
    setIsDragging(true)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    } else {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDragging])

  return (
    <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <Droppable droppableId="topNavigation" direction="horizontal">
        {(provided) => (
          <div
            className={`top-navigation-container ${isDragging ? 'dragging' : ''}`}
            style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
            ref={provided.innerRef}
            {...provided.droppableProps}
            onMouseDown={handleMouseDown}>
            <Link
              className={`${selectedRoute === APP_ROUTES.CHATS ? 'selected' : ''}`}
              onClick={() => setPageRoute(APP_ROUTES.CHATS)}
              to={APP_ROUTES.CHATS}>
              <ChatNotification />
            </Link>

            <Link
              className={`${selectedRoute === APP_ROUTES.TODAY_PATIENTS_LIST ? 'selected' : ''}`}
              onClick={() => setPageRoute(APP_ROUTES.TODAY_PATIENTS_LIST)}
              to={APP_ROUTES.TODAY_PATIENTS_LIST}>
              <Cast />
            </Link>

            <Link
              className={`${selectedRoute === APP_ROUTES.CALENDAR ? 'selected' : ''}`}
              onClick={() => setPageRoute(APP_ROUTES.CALENDAR)}
              to={APP_ROUTES.CALENDAR}>
              <Calendar />
            </Link>

            <Link
              className={`${selectedRoute === APP_ROUTES.STATISTICS ? 'selected' : ''}`}
              onClick={() => setPageRoute(APP_ROUTES.STATISTICS)}
              to={APP_ROUTES.STATISTICS}>
              <PieChart />
            </Link>

            <Link>
              <PatientListModal />
            </Link>

            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}
