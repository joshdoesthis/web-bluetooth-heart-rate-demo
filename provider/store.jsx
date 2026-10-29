import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const StoreContext = createContext(null)

const initialState = {
  data: [],
  device: null,
  drawerVisible: false
}

// `set` takes either an object to merge into the state, or a function that
// receives the current state and returns the whole new state.
const Store = ({ children }) => {
  const [state, setState] = useState(initialState)

  const set = useCallback(
    next => setState(s => (typeof next === 'function' ? next(s) : { ...s, ...next })),
    []
  )

  const value = useMemo(() => ({ state, set }), [state, set])

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

const useStore = () => useContext(StoreContext)

export { Store, useStore }
