import { createContext } from 'react'
export * from './ChatProvider'

const Context = createContext()

function ContextProvider(props) {
  return <Context.Provider value={{}}>{props.children}</Context.Provider>
}

const ContextConsumer = Context

export { ContextProvider, ContextConsumer }
