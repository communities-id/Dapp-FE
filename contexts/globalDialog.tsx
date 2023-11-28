import { useState, useContext, createContext, ReactNode, useEffect, useRef, useMemo } from 'react'
import { useRouter } from 'next/navigation'

import MintSuccessDialog from '@/components/dialog/mintSuccess'
import CommunityProfileSettingDialog from '@/components/dialog/community/profileSetting'
import MemberMintDialog from '@/components/_dialog/member/mint'
import BrandManageDialog from '@/components/_dialog/brand/manage'
import BrandNotLoadedDialog from '@/components/_dialog/brand/notLoaded'

import MobileBrandManageDrawer from '@/components/_dialog/brand/mobile/manageMenus'
import MobileBrandManageProfileSettingDialog from '@/components/_dialog/brand/mobile/manageProfileSetting'
import MobileBrandManageAccountSettingDialog from '@/components/_dialog/brand/mobile/manageAccountSetting'
import MobileBrandManageMintSettingDialog from '@/components/_dialog/brand/mobile/manageMintSetting'
import MobileBrandManageRenewSettingDialog from '@/components/_dialog/brand/mobile/manageRenewSetting'
import MobileBrandManageTGSettingDialog from '@/components/_dialog/brand/mobile/manageTGSetting'

import { CommunityInfo, SearchModeType } from '@/types'

type MobileGlobalDialogNames = 'mobile-manage-drawer' | 'mobile-manage-profile-setting' | 'mobile-manage-account-setting' | 'mobile-manage-mint-setting' | 'mobile-manage-renew-setting' | 'mobile-manage-tg-setting'
type GlobalDialogNames = MobileGlobalDialogNames | 'brand-profile-setting' | 'brand-manage-setting' | 'brand-not-loaded' | 'member-mint' | string

interface GlobalDialogPayload {
  brandName?: string
  brandInfo?: Partial<CommunityInfo>
}

interface GlobalDialogContextProps {
  dialogOpenSet: Partial<Record<GlobalDialogNames, boolean>>
  showGlobalDialog: (name: GlobalDialogNames, payload?: GlobalDialogPayload) => void
  closeGlobalDialog: (name: string | number) => void
  handleMintSuccess: (info: { owner: string; community: string; member?: string; avatar?: string, duplFromBrandInfo?: Partial<CommunityInfo> }, mode: SearchModeType) => void
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
  const [mintSuccessInfo, setMintSuccessInfo] = useState<{ open: boolean; mode: SearchModeType; duplFromBrandInfo?: Partial<CommunityInfo> } & Record<'community' | 'member' | 'owner' | 'avatar', string>>({
    open: false,
    mode: 'unknown',
    community: '',
    member: '',
    owner: '',
    avatar: '',
    duplFromBrandInfo: {},
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
        const { community, member = '', owner, avatar = '', duplFromBrandInfo } = info
        setMintSuccessInfo({ open: true, mode, community, member, owner, avatar, duplFromBrandInfo })
      }
    }}>
      {/* mobile */}
      <MobileBrandManageDrawer
        open={Boolean(dialogOpenSet['mobile-manage-drawer'])}
        brandName={dialogPayload.brandName}
        brandInfo={dialogPayload.brandInfo}
        handleClose={() => closeGlobalDialog('mobile-manage-drawer')}
        handleChooseTab={(tabName) => {
          showGlobalDialog(tabName)
        }}
      />
      <MobileBrandManageProfileSettingDialog
        open={Boolean(dialogOpenSet['mobile-manage-profile-setting'])}
        brandName={dialogPayload.brandName}
        brandInfo={dialogPayload.brandInfo}
        handleClose={() => closeGlobalDialog('mobile-manage-profile-setting')}
      />
      <MobileBrandManageAccountSettingDialog
        open={Boolean(dialogOpenSet['mobile-manage-account-setting'])}
        brandName={dialogPayload.brandName}
        brandInfo={dialogPayload.brandInfo}
        handleClose={() => closeGlobalDialog('mobile-manage-account-setting')}
      />
      <MobileBrandManageMintSettingDialog
        open={Boolean(dialogOpenSet['mobile-manage-mint-setting'])}
        brandName={dialogPayload.brandName}
        brandInfo={dialogPayload.brandInfo}
        handleClose={() => closeGlobalDialog('mobile-manage-mint-setting')}
      />
      <MobileBrandManageRenewSettingDialog
        open={Boolean(dialogOpenSet['mobile-manage-renew-setting'])}
        brandName={dialogPayload.brandName}
        brandInfo={dialogPayload.brandInfo}
        handleClose={() => closeGlobalDialog('mobile-manage-renew-setting')}
      />
      <MobileBrandManageTGSettingDialog
        open={Boolean(dialogOpenSet['mobile-manage-tg-setting'])}
        brandName={dialogPayload.brandName}
        brandInfo={dialogPayload.brandInfo}
        handleClose={() => closeGlobalDialog('mobile-manage-tg-setting')}
      />
      {/* pc */}
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