import React from 'react'
import ReactDOM from 'react-dom/client'
import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import * as serviceWorker from './serviceWorkerRegistration'
import { ChatProvider, TodayPatientsListProvider } from './context'

const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(
  <BrowserRouter>
    <ChatProvider>
      <TodayPatientsListProvider>
        <ChakraProvider
          toastOptions={{
            defaultOptions: {
              title: "quelque chose s'est mal passé. veuillez réessayer plus tard",
              status: 'error',
              duration: 5000,
              isClosable: true,
              position: 'bottom-right',
              variant: 'solid',
            },
          }}>
          <App />
        </ChakraProvider>
      </TodayPatientsListProvider>
    </ChatProvider>
  </BrowserRouter>,
)

serviceWorker.register()
