import { useState, useContext, createContext, ReactNode, useEffect, useRef, useMemo } from 'react'
import { useRouter } from 'next/navigation'

import CommunityProfileSettingDialog from '@/components/dialog/community/profileSetting'
import CommunityMintSettingDialog from '@/components/dialog/community/mintSetting'
import MintSuccessDialog from '@/components/dialog/mintSuccess'

import { SearchModeType } from '@/types'

interface GlobalDialogContextProps {
  dialogOpenSet: Record<string | number, boolean>
  showGlobalDialog: (name: string | number) => void
  closeGlobalDialog: (name: string | number) => void
  handleMintSuccess: (info: { owner: string; community: string; member?: string; avatar?: string }, mode: SearchModeType) => void
}

const GlobalDialogContext = createContext<GlobalDialogContextProps>({
  dialogOpenSet: {},
  showGlobalDialog: () => {},
  closeGlobalDialog: () => {},
  handleMintSuccess: () => {},
})

export const useGlobalDialog = () => {
  return useContext(GlobalDialogContext)
}

export function GlobalDialogProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  
  const [dialogOpenSet, setDialogOpenSet] = useState<Record<string, boolean>>({})
  const [mintSuccessInfo, setMintSuccessInfo] = useState<{ open: boolean; mode: SearchModeType } & Record<'community' | 'member' | 'owner' | 'avatar', string>>({
    open: false,
    mode: 'unknown',
    community: '',
    member: '',
    owner: '',
    avatar: ''
  })

  const showGlobalDialog = (name: string | number) => {
    setDialogOpenSet((prev) => ({
      ...prev,
      [name]: true,
    }))
  }

  const closeGlobalDialog = (name: string | number) => {
    setDialogOpenSet((prev) => ({
      ...prev,
      [name]: false,
    }))
  }

  return (
    <GlobalDialogContext.Provider value={{
      dialogOpenSet,
      showGlobalDialog,
      closeGlobalDialog,
      handleMintSuccess: (info, mode) => {
        const { community, member = '', owner, avatar = '' } = info
        setMintSuccessInfo({ open: true, mode, community, member, owner, avatar })
      }
    }}>
      <CommunityProfileSettingDialog
        open={Boolean(dialogOpenSet['profile'])}
        handleClose={() => closeGlobalDialog('profile')} />
      <CommunityMintSettingDialog
        open={Boolean(dialogOpenSet['mint'])}
        handleClose={() => closeGlobalDialog('mint')} />
      <MintSuccessDialog
        { ...mintSuccessInfo }
        handleClose={() => {
          location.reload()
          // setShowMintSuccess(false)
          // window.scrollTo({ top: 0, behavior: 'smooth' })
        }}
        handleConfirm={(mode, community, member) => {
          if (mode === 'community') {
            setMintSuccessInfo(prev => ({ ...prev, open: false }))
            showGlobalDialog('mint')
            return
          }
          if (mode === 'member') {
            router.push(`/member/${member}.${community}`)
            setMintSuccessInfo(prev => ({ ...prev, open: false }))
            return
          }
          location.reload()
          // location.reload()
          // setShowMintSuccess(false)
          // window.scrollTo({ top: 0, behavior: 'smooth' })
        }}
      />
      {children}
    </GlobalDialogContext.Provider>
  )
}