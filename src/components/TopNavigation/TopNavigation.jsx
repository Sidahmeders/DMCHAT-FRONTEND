import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Cast, Calendar, PieChart } from 'react-feather'
import { getPageRoute, setPageRoute } from '@utils'
import { APP_ROUTES } from '@config'
// import ChatNotification from '../miscellaneous/ChatNotification'
import PatientListModal from '../PatientsListModal/PatientsListModal'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import './TopNavigation.scss'

export default function TopNavigation() {
  const location = useLocation()
  const [selectedRoute, setSelectedRoute] = useState(getPageRoute())
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [initialTouchPosition, setInitialTouchPosition] = useState({ x: 0, y: 0 })
  const [initialPosition, setInitialPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)

  const handleDragStart = () => setIsDragging(true)
  const handleMouseDown = () => setIsDragging(true)
  const handleDragEnd = () => setIsDragging(false)
  const handleTouchEnd = () => setIsDragging(false)
  const handleMouseUp = () => setIsDragging(false)

  const handleMouseMove = (event) => {
    if (isDragging) {
      setPosition((prevPosition) => ({
        x: prevPosition.x + event.movementX,
        y: prevPosition.y + event.movementY,
      }))
    }
  }

  const handleTouchStart = (event) => {
    setIsDragging(true)
    const touch = event.touches[0]
    setInitialTouchPosition({ x: touch.clientX, y: touch.clientY })
    setInitialPosition({ x: position.x, y: position.y })
  }

  const handleTouchMove = (event) => {
    if (isDragging) {
      const touch = event.touches[0]
      setPosition({
        x: initialPosition.x + (touch.clientX - initialTouchPosition.x),
        y: initialPosition.y + (touch.clientY - initialTouchPosition.y),
      })
      setInitialTouchPosition({ x: touch.clientX, y: touch.clientY })
    }
  }

  useEffect(() => {
    if (position.x < -250) {
      setPosition({ ...position, x: 5 })
    }
    if (position.x > window.outerWidth - 50) {
      setPosition({ ...position, x: position.x - 100 })
    }
    if (position.y > 50) {
      setPosition({ ...position, y: -5 })
    }
    if (Math.abs(position.y) > window.outerHeight - 50) {
      setPosition({ ...position, y: position.y + 25 })
    }
  }, [position])

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('touchmove', handleTouchMove, { passive: false })
      document.addEventListener('mouseup', handleMouseUp)
      document.addEventListener('touchend', handleTouchEnd, { passive: false })
    } else {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('touchend', handleTouchEnd)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('touchend', handleTouchEnd)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDragging])

  useEffect(() => {
    setSelectedRoute(getPageRoute())
  }, [location.pathname])

  return (
    <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <Droppable droppableId="topNavigation" direction="horizontal">
        {(provided) => (
          <div
            className={`top-navigation-container ${isDragging ? 'dragging' : ''}`}
            style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
            ref={provided.innerRef}
            {...provided.droppableProps}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}>
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
