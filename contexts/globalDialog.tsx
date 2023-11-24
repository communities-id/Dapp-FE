import { useState, useContext, createContext, ReactNode, useEffect, useRef, useMemo } from 'react'
import { useRouter } from 'next/navigation'

import MintSuccessDialog from '@/components/dialog/mintSuccess'
import CommunityProfileSettingDialog from '@/components/dialog/community/profileSetting'
import MemberMintDialog from '@/components/_dialog/member/mint'
import BrandManageDialog from '@/components/_dialog/brand/manage'
import BrandNotLoadedDialog from '@/components/_dialog/brand/notLoaded'

import { CommunityInfo, SearchModeType } from '@/types'

type GlobalDialogNames = 'brand-profile-setting' | 'brand-manage-setting' | 'brand-not-loaded' | 'member-mint' | string

interface GlobalDialogPayload {
  brandName?: string
  brandInfo?: Partial<CommunityInfo>
}

interface GlobalDialogContextProps {
  dialogOpenSet: Partial<Record<GlobalDialogNames, boolean>>
  showGlobalDialog: (name: GlobalDialogNames, payload?: GlobalDialogPayload) => void
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
  
  const [dialogOpenSet, setDialogOpenSet] = useState<Partial<Record<GlobalDialogNames, boolean>>>({})
  const [dialogPayload, setDialogPayload] = useState<GlobalDialogPayload>({})
  const [mintSuccessInfo, setMintSuccessInfo] = useState<{ open: boolean; mode: SearchModeType } & Record<'community' | 'member' | 'owner' | 'avatar', string>>({
    open: false,
    mode: 'unknown',
    community: '',
    member: '',
    owner: '',
    avatar: ''
  })

  const showGlobalDialog = (name: GlobalDialogNames, payload?: GlobalDialogPayload) => {
    payload && setDialogPayload(payload)
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
        open={Boolean(dialogOpenSet['brand-setting-profile'])}
        handleClose={() => closeGlobalDialog('brand-setting-profile')} />
      <MemberMintDialog
        open={Boolean(dialogOpenSet['member-mint'])}
        brandName={dialogPayload.brandName}
        brandInfo={dialogPayload.brandInfo}
        handleClose={() => closeGlobalDialog('member-mint')}
      />
      <BrandManageDialog
        open={Boolean(dialogOpenSet['brand-manage-setting'])}
        brandName={dialogPayload.brandName}
        brandInfo={dialogPayload.brandInfo}
        handleClose={() => closeGlobalDialog('brand-manage-setting')}
      />
      <BrandNotLoadedDialog
        brandName={dialogPayload.brandName}
        brandInfo={dialogPayload.brandInfo}
        open={Boolean(dialogOpenSet['brand-not-loaded'])}
        handleClose={() => closeGlobalDialog('brand-not-loaded')}
        handleConfirm={({ brandName, brandInfo }) => {
          closeGlobalDialog('brand-not-loaded')
          showGlobalDialog('brand-manage-setting', { brandName, brandInfo })
        }}
      />
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
            showGlobalDialog('brand-manage-setting', { brandName: community })
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