import React from 'react'
import ReactDOM from 'react-dom/client'
import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import * as serviceWorker from './serviceWorkerRegistration'
import ChatProvider from './context/ChatProvider'

const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(
  <BrowserRouter>
    <ChatProvider>
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
    </ChatProvider>
  </BrowserRouter>,
)

serviceWorker.register()
