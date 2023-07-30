import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './auth'
import { v4 as uuidv4 } from 'uuid'

const { VITE_AUTH_USER_GROUP } = import.meta.env

const StoreContext = createContext({})

const Store = ({ children }) => {
  const [state, setState] = useState({
    queue: []
  })
  const [listeners, setListeners] = useState([])

  const subscribe = listener => {
    const newId = uuidv4()
    setListeners(listeners => [...listeners, { id: newId, listener }])
    return newId
  }

  const unsubscribe = id => {
    setListeners(listeners => listeners.filter(listener => listener.id !== id))
  }

  const set = newState => {
    if (typeof newState === 'function') setState(state => newState(state))
    else setState(state => ({ ...state, ...newState }))
  }

  const get = () => state

  useEffect(() => listeners.forEach(({ listener }) => listener(state)), [state])

  const auth = useAuth()

  useEffect(() => {
    if (auth.state.refreshing) return
    if (Object.keys(state.queue).length !== 0) {
      ;(async () => await auth.refresh())()
    }
  }, [state.queue])

  useEffect(() => {
    if (auth.state.refreshing) return
    if (Object.keys(state.queue).length !== 0) {
      Promise.all(
        Object.values(state.queue ?? {}).map(fn => fn(auth.state.accessToken))
      ).then(res => {
        const newState = res.reduce(
          (acc, { name, ...rest }) => ({
            ...acc,
            ...(name ? { [name]: rest } : null)
          }),
          {}
        )
        set(state => ({ ...state, ...newState, queue: {} }))
      })
    }
  }, [auth.state.refreshing])

  const query = async ({
    name,
    url,
    method,
    body,
    headers,
    authenticate = false
  }) => {
    if (authenticate) {
      const fn = async accessToken => {
        try {
          const res = await fetch(url, {
            method,
            headers: {
              'Content-Type': 'application/json',
              'x-access-token': accessToken,
              'x-user-group': VITE_AUTH_USER_GROUP,
              ...headers
            },
            body
          })
          return { name, ...(await res.json()) }
        } catch (err) {
          console.error(err)
        }
      }
      set(state => ({
        ...state,
        queue: { ...state.queue, [name]: fn }
      }))
    } else {
      try {
        const res = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
            ...headers
          },
          body
        })
        const { ok, message, data } = await res.json()
        set(state => ({ ...state, [name]: { ok, message, data } }))
      } catch (err) {
        console.error(err)
      }
    }
  }

  return (
    <StoreContext.Provider value={{ subscribe, unsubscribe, set, get, query }}>
      {children}
    </StoreContext.Provider>
  )
}

const useStore = () => {
  const { subscribe, unsubscribe, set, get, query } = useContext(StoreContext)
  const [state, setState] = useState(get())

  useEffect(() => {
    const id = subscribe(state => setState(state))
    return () => unsubscribe(id)
  }, [])

  return { state, set, query }
}

export { Store, useStore }
