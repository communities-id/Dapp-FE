import { useState, useContext, createContext, ReactNode, useEffect, useRef, useMemo } from 'react'
import classnames from 'classnames'
import { useRouter } from 'next/router'
import { useNetwork, useSwitchNetwork } from 'wagmi'

import { track as trackEvt } from '@/shared/track'

import Snackbar, { SnackbarType } from '@/components/common/snackbar'

import 'swiper/css';
import 'swiper/css/pagination';

// import Swiper JS
// import Swiper, { Pagination, Autoplay } from 'swiper';

// import ScrollReveal
// import ScrollReveal from 'scrollreveal';

type SnackbarMessage = {
  type: SnackbarType
  content: ReactNode
  title?: string
  open?: boolean
}

interface RootContextConfigProps {
  page: 'home' | 'blog-grid' | 'blog-single' | 'signin' | 'signup' | '404'
  darkMode: boolean
  setDarkMode: (value: boolean) => void
  toggleDarkMode: () => void
  stickyMenu: boolean
  setStickyMenu: (value: boolean) => void
  toggleStickyMenu: () => void
  navigationOpen: boolean
  setNavigationOpen: (value: boolean) => void
  toggleNavigationOpen: () => void
  scrollTop: boolean
  setScrollTop: (value: boolean) => void
  // toggleScrollTop: (value: boolean) => void
}

interface RootContextProps {
  sr: any | null
  loaded: boolean
  config: RootContextConfigProps
  message: (info: SnackbarMessage, track?: Record<string, string | number>) => void
  tracker: (t: string, info?: Record<string, string | number>) => void
  NetOps: {
    loading: boolean
    handleSwitchNetwork: (network: number) => Promise<number>
  }
}

const Context = createContext<RootContextProps>({
  sr: null,
  loaded: false,
  config: {
    page: 'home',
    darkMode: false,
    setDarkMode: () => {},
    toggleDarkMode: () => {},
    stickyMenu: false,
    setStickyMenu: () => {},
    toggleStickyMenu: () => {},
    navigationOpen: false,
    setNavigationOpen: () => {},
    toggleNavigationOpen: () => {},
    scrollTop: false,
    setScrollTop: () => {},
    // toggleScrollTop: () => {},
  },
  message: () => {},
  tracker: () => {},
  NetOps: {
    loading: false,
    handleSwitchNetwork: async () => 0,
  },
})

export function RootProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const { chain } = useNetwork()
  const { switchNetworkAsync } = useSwitchNetwork()
  const [switchNetworkLoading, setSwitchNetworkLoading] = useState(false)

  const refToComponent = useRef(null)
  const [sr, setSr] = useState()
  const [loaded, setLoaded] = useState(false)

  const [page, setPage] = useState<RootContextConfigProps['page']>('home')
  const [darkMode, setDarkMode] = useState<RootContextConfigProps['darkMode']>(false)
  const [stickyMenu, setStickyMenu] = useState<RootContextConfigProps['stickyMenu']>(false)
  const [navigationOpen, setNavigationOpen] = useState<RootContextConfigProps['navigationOpen']>(false)
  const [scrollTop, setScrollTop] = useState<RootContextConfigProps['scrollTop']>(false)

  const [snackbarInfo, setSnackbarInfo] = useState<Required<SnackbarMessage>>({
    open: false,
    type: 'success',
    title: 'Tip',
    content: '',
  })

  const handleTrack = (t: string, info?: Record<string, string | number>) => {
    trackEvt(t, info)
  }

  const showMessage = (info: SnackbarMessage, track?: Record<string, string | number>) => {
    setSnackbarInfo({
      title: 'Tip', // default title
      ...info,
      open: true,
    })
    if (track) {
      const { t, i = 1, ...info } = track
      handleTrack(`${info.type}:${t}:${i}`, { message: info.content, ...info })
    }
  }

  const hideMessage = () => {
    setSnackbarInfo((prev) => ({ ...prev, open: false }))
  }

  const _setDarkMode = (value = false) => {
    setDarkMode(value)
    document.body.classList.toggle('dark', value)
    localStorage.setItem('darkMode', value ? 'true' : 'false')
  }

  const toggleDarkMode = () => {
    _setDarkMode(!darkMode)
  }

  const toggleNavigationOpen = () => {
    setNavigationOpen(!navigationOpen)
  }

  const toggleStickyMenu = () => {
    setStickyMenu(!stickyMenu)
  }

  const handleSwitchNetwork = async (network: number) => {
    if (Number(chain?.id) !== Number(network)) {
      try {
        setSwitchNetworkLoading(true)
        // setIsSwitchNetwork(true)
        await switchNetworkAsync?.(network)
        setSwitchNetworkLoading(false)
      } catch (e) {
        setSwitchNetworkLoading(false)
        throw e
      }
    }
    return Number(network)
  }

  const rootConfig = useMemo(() => {
    return {
      page,
      darkMode,
      setDarkMode: _setDarkMode,
      toggleDarkMode,
      stickyMenu,
      setStickyMenu,
      toggleStickyMenu,
      navigationOpen,
      setNavigationOpen,
      toggleNavigationOpen,
      scrollTop,
      setScrollTop,
    }
  }, [page, darkMode, stickyMenu, navigationOpen, scrollTop])

  useEffect(() => {
    if (typeof window === 'undefined') return
    _setDarkMode(localStorage.getItem('darkMode') === 'true')

  }, [])
  useEffect(() => {
    if (typeof window === 'undefined') return
    // console.log('---------- root init', refToComponent.current, router.pathname)

    async function animate() {
      if (!refToComponent.current) return

      const ScrollReveal = (await import("scrollreveal")).default
      const sr = ScrollReveal({
        distance: '60px',
        duration: 800,
        reset: false
      })
      sr.reveal(`.animate_top`, {
        origin: 'top',
        interval: 100,
      })
      
      sr.reveal(`.animate_left`, {
        origin: 'left',
        interval: 100,
      });
      
      sr.reveal(`.animate_right`, {
        origin: 'right',
        interval: 100,
      })
      setLoaded(true)
    }
    animate()

    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 20) {
        setStickyMenu(true)
      } else {
        setStickyMenu(false)
      }
      setScrollTop(window.pageYOffset > 50)
    })
  }, [router.pathname])

  return (
    <Context.Provider value={{
      sr: sr!,
      loaded,
      config: rootConfig,
      message: showMessage,
      tracker: handleTrack,
      NetOps: {
        loading: switchNetworkLoading,
        handleSwitchNetwork,
      },
    }}>
      <Snackbar {...snackbarInfo} handleClose={hideMessage}/>
      <div className={classnames({ 'bg-black': darkMode })} ref={refToComponent}>{children}</div>
    </Context.Provider>
  )
}

export function useRoot() {
  return useContext(Context);
}

export function useRootConfig() {
  return useContext(Context).config;
}