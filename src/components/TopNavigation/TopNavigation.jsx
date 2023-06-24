import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Cast, Calendar, PieChart } from 'react-feather'

import { getPageRoute, setPageRoute } from '@utils'
import { APP_ROUTES } from '@config'

import ChatNotification from '../miscellaneous/ChatNotification'
import PatientListModal from '../PatientsListModal/PatientsListModal'

import './TopNavigation.scss'

export default function TopNavigation() {
  const location = useLocation()
  const [selectedRoute, setSelectedRoute] = useState(getPageRoute())

  useEffect(() => {
    setSelectedRoute(getPageRoute())
  }, [location.pathname])

  return (
    <div className="top-navigation-container">
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
    </div>
  )
}
