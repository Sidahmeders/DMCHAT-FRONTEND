import { Routes, Route, Navigate } from 'react-router-dom'
import { Home, Chat, TodayPatientsList, Statistics, Calendar } from './pages'

import { ChatState } from './context'
import TopNavigation from './components/TopNavigation/TopNavigation'

import { APP_ROUTES } from './config'

import './App.css'

const App = () => {
  const { user } = ChatState()

  return (
    <div className="App">
      {user && <TopNavigation />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path={APP_ROUTES.CHATS} element={<Chat />} />
        <Route path={APP_ROUTES.TODAY_PATIENTS_LIST} element={<TodayPatientsList />} />
        <Route path={APP_ROUTES.CALENDAR} element={<Calendar />} />
        <Route path={APP_ROUTES.STATISTICS} element={<Statistics />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default App
