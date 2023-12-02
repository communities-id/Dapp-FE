import { useState, useContext, createContext, ReactNode, useEffect, useRef, useMemo } from 'react'
import { useRouter } from 'next/navigation'

import MintSuccessDialog from '@/components/_dialog/tools/mintSuccess'
import MobileMintSuccessDialog from '@/components/_dialog/tools/mobile/mintSuccess'

import BrandMintDrawer from '@/components/_dialog/brand/mint'
import CommunityProfileSettingDialog from '@/components/dialog/community/profileSetting'
import MemberMintDialog from '@/components/_dialog/member/mint'
import BrandManageDialog from '@/components/_dialog/brand/manage'
import BrandNotLoadedDialog from '@/components/_dialog/brand/notLoaded'

import MobileBrandMintDrawer from '@/components/_dialog/brand/mobile/mint'
import MobileBrandManageDrawer from '@/components/_dialog/brand/mobile/manage/manageMenus'
import MobileBrandManageProfileSettingDialog from '@/components/_dialog/brand/mobile/manage/manageProfileSetting'
import MobileBrandManageAccountSettingDialog from '@/components/_dialog/brand/mobile/manage/manageAccountSetting'
import MobileBrandManageMintSettingDialog from '@/components/_dialog/brand/mobile/manage/manageMintSetting'
import MobileBrandManageRenewSettingDialog from '@/components/_dialog/brand/mobile/manage/manageRenewSetting'
import MobileBrandManageTGSettingDialog from '@/components/_dialog/brand/mobile/manage/manageTGSetting'
import MobileBrandInvitationDialog from '@/components/_dialog/brand/mobile/invitation'
import MobileMemberMintDialog from '@/components/_dialog/member/mobile/mint'

import { CommunityInfo, SearchModeType } from '@/types'

type MobileGlobalDialogNames = 'mobile-brand-mint' | 'mobile-manage-drawer' | 'mobile-manage-profile-setting' | 'mobile-manage-account-setting' | 'mobile-manage-mint-setting' | 'mobile-manage-renew-setting' | 'mobile-manage-tg-setting' | 'mobile-brand-invitation' | 'mobile-member-mint'
type GlobalDialogNames = MobileGlobalDialogNames | 'brand-mint' | 'brand-profile-setting' | 'brand-manage-setting' | 'brand-not-loaded' | 'member-mint' | 'mobile-member-mint' | 'brand-mint-success' | 'mobile-brand-mint-success' | string

interface GlobalDialogPayload {
  mobile?: boolean
  brandName?: string
  brandInfo?: Partial<CommunityInfo>
  options?: {
    mintNetwork?: number
    invitationCode?: string
    mintTo?: string
  }
}

interface GlobalDialogContextProps {
  dialogOpenSet: Partial<Record<GlobalDialogNames, boolean>>
  showGlobalDialog: (name: GlobalDialogNames, payload?: GlobalDialogPayload) => void
  closeGlobalDialog: (name: string | number) => void
  handleMintSuccess: (info: { mobile?: boolean; drawer?: boolean, owner: string; community: string; member?: string; avatar?: string, duplFromBrandInfo?: Partial<CommunityInfo> }, mode: SearchModeType) => void
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
  const [dialogPayload, setDialogPayload] = useState<GlobalDialogPayload>({ options: {} })
  const [mintSuccessInfo, setMintSuccessInfo] = useState<{ mobile: boolean, drawer: boolean; mode: SearchModeType; duplFromBrandInfo?: Partial<CommunityInfo> } & Record<'community' | 'member' | 'owner' | 'avatar', string>>({
    mobile: false,
    drawer: false,
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
    console.log('- showGlobalDialog -', name, payload)
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
        const { mobile = false, drawer = false, community, member = '', owner, avatar = '', duplFromBrandInfo } = info
        if (mobile) {
          showGlobalDialog('mobile-brand-mint-success')
        } else {
          showGlobalDialog('brand-mint-success')
        }
        setMintSuccessInfo({ mobile, drawer, mode, community, member, owner, avatar, duplFromBrandInfo })
      }
    }}>
      {/* mobile */}
      <MobileBrandMintDrawer
        open={Boolean(dialogOpenSet['mobile-brand-mint'])}
        brandName={dialogPayload.brandName}
        brandInfo={dialogPayload.brandInfo}
        options={dialogPayload.options}
        handleClose={() => closeGlobalDialog('mobile-brand-mint')}
      />
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
      <MobileBrandInvitationDialog
        open={Boolean(dialogOpenSet['mobile-brand-invitation'])}
        brandName={dialogPayload.brandName}
        brandInfo={dialogPayload.brandInfo}
        handleClose={() => closeGlobalDialog('mobile-brand-invitation')}
      />
      <MobileMemberMintDialog
        open={Boolean(dialogOpenSet['mobile-member-mint'])}
        brandName={dialogPayload.brandName}
        brandInfo={dialogPayload.brandInfo}
        handleClose={() => closeGlobalDialog('mobile-member-mint')}
      />
      <MobileMintSuccessDialog
        open={Boolean(dialogOpenSet['mobile-brand-mint-success'])}
        { ...mintSuccessInfo }
        // handleClose={() => {
        //   location.reload()
        //   // setShowMintSuccess(false)
        //   // window.scrollTo({ top: 0, behavior: 'smooth' })
        // }}
        handleConfirm={(mode, community, member, drawer) => {
          if (mode === 'community') {
            closeGlobalDialog('mobile-brand-mint-success')
            if (drawer) {
              router.push(`/community/${community}`)
            } else {
              showGlobalDialog('mobile-manage-mint-setting', { brandName: community, options: {} })
            }
            return
          }
          if (mode === 'member') {
            router.push(`/member/${member}.${community}`)
            closeGlobalDialog('mobile-brand-mint-success')
            return
          }
          location.reload()
          // location.reload()
          // setShowMintSuccess(false)
          // window.scrollTo({ top: 0, behavior: 'smooth' })
        }}
      />
      {/* pc */}
      <BrandMintDrawer
        open={Boolean(dialogOpenSet['brand-mint'])}
        brandName={dialogPayload.brandName}
        brandInfo={dialogPayload.brandInfo}
        options={dialogPayload.options}
        handleClose={() => closeGlobalDialog('brand-mint')}
      />
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
          if (dialogPayload.mobile) {
            showGlobalDialog('mobile-manage-drawer', { brandName, brandInfo, options: dialogPayload.options })
            return
          }
          showGlobalDialog('brand-manage-setting', { brandName, brandInfo, options: {} })
        }}
      />
      <MintSuccessDialog
        open={Boolean(dialogOpenSet['brand-mint-success'])}
        { ...mintSuccessInfo }
        handleClose={() => {
          location.reload()
          // setShowMintSuccess(false)
          // window.scrollTo({ top: 0, behavior: 'smooth' })
        }}
        handleConfirm={(mode, community, member, drawer) => {
          if (mode === 'community') {
            closeGlobalDialog('brand-mint-success')
            if (drawer) {
              router.push(`/community/${community}`)
            } else {
              showGlobalDialog('manage-mint-setting', { brandName: community, options: {} })
            }
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