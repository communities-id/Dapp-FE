import { createContext, FC, ReactNode, useContext, useEffect, useMemo, useRef, useState } from 'react'

interface ConfigurationContextProps {
  masterAddress: string
  ipfs: {
    key: string
    gateway: string
  }
}

const ConfigurationContext = createContext<ConfigurationContextProps>({
  masterAddress: '',
  ipfs: {
    key: '',
    gateway: ''
  }
})

export const useConfiguration = () => useContext(ConfigurationContext)

export const ConfigurationProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [masterAddress, setMasterAddress] = useState('')
  const [ipfs, setIpfs] = useState<{ key: string; gateway: string }>({ key: '', gateway: '' })

  useEffect(() => {
    fetch('/api/config').then((res) => res.json()).then((res) => {
      setMasterAddress(res.data.master)
      setIpfs(res.data.ipfs)
    })
  }, [])

  return (
    <ConfigurationContext.Provider value={{ masterAddress, ipfs }}>
      {children}
    </ConfigurationContext.Provider>
  )
}