import { useState, useContext, createContext, ReactNode, useEffect, useRef, useMemo } from 'react'
import { useRouter, usePathname } from 'next/navigation'

import { qs } from '@/utils/tools'

import MintSuccessDialog from '@/components/_dialog/tools/mintSuccess'
import MobileMintSuccessDialog from '@/components/_dialog/tools/mobile/mintSuccess'
import BrandMintDrawer from '@/components/_dialog/brand/mint'
import CommunityProfileSettingDialog from '@/components/dialog/community/profileSetting'
import MemberMintDialog from '@/components/_dialog/member/mint'
import BrandManageDialog from '@/components/_dialog/brand/manage'
import BrandNotLoadedDialog from '@/components/_dialog/brand/notLoaded'
import MemberDetailDialog from '@/components/_dialog/member/detail'
import MemberBurn from '@/components/_dialog/member/burn'
import MemberRenew from '@/components/_dialog/member/renew'
import MemberPrimary from '@/components/_dialog/member/primary'

import MobileBrandMintDrawer from '@/components/_dialog/brand/mobile/mint'
import MobileBrandManageDrawer from '@/components/_dialog/brand/mobile/manage/manageMenus'
import MobileBrandManageProfileSettingDialog from '@/components/_dialog/brand/mobile/manage/manageProfileSetting'
import MobileBrandManageAccountSettingDialog from '@/components/_dialog/brand/mobile/manage/manageAccountSetting'
import MobileBrandManageMintSettingDialog from '@/components/_dialog/brand/mobile/manage/manageMintSetting'
import MobileBrandManageRenewSettingDialog from '@/components/_dialog/brand/mobile/manage/manageRenewSetting'
import MobileBrandManageTGSettingDialog from '@/components/_dialog/brand/mobile/manage/manageTGSetting'
import MobileBrandInvitationDialog from '@/components/_dialog/brand/mobile/invitation'
import MobileMemberMintDialog from '@/components/_dialog/member/mobile/mint'
import MobileMemberDetailDialog from '@/components/_dialog/member/mobile/detail'
import MobileMemberBurn from '@/components/_dialog/member/mobile/burn'
import MobileMemberRenew from '@/components/_dialog/member/mobile/renew'
import MobileMemberPrimary from '@/components/_dialog/member/mobile/primary'

import { CommunityInfo, MemberInfo, SearchModeType } from '@/types'
import { execSearch } from '@/shared/helper'

type MobileGlobalDialogNames = 'mobile-brand-mint'
  | 'mobile-manage-drawer'
  | 'mobile-manage-profile-setting'
  | 'mobile-manage-account-setting'
  | 'mobile-manage-mint-setting'
  | 'mobile-manage-renew-setting'
  | 'mobile-manage-tg-setting'
  | 'mobile-brand-invitation'
  | 'mobile-member-mint'
  | 'mobile-member-burn'
  | 'mobile-member-renew'
  | 'mobile-member-primary'
  | 'mobile-brand-mint-success'

type GlobalDialogNames = MobileGlobalDialogNames
 | 'brand-mint'
 | 'brand-profile-setting'
 | 'brand-manage-setting'
 | 'brand-not-loaded'
 | 'member-mint'
 | 'brand-mint-success'
 | 'member-detail'
 | 'member-burn'
 | 'member-renew'
 | 'member-primary'
 | string

interface GlobalDialogPayload {
  mobile?: boolean
  brandName?: string
  brandInfo?: Partial<CommunityInfo>
  memberName?: string
  memberInfo?: Partial<MemberInfo>
  options?: {
    mintNetwork?: number
    invitationCode?: string
    mintTo?: string
    mintName?: string
    notLoaded?: boolean
    simpleMode?: boolean
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
  const pathname = usePathname()
  
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
    if (dialogOpenSet[name]) return
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

  useEffect(() => {
    if (!pathname) return
    if (dialogOpenSet['member-detail'] || dialogOpenSet['mobile-member-detail']) {
      if (dialogPayload.options?.simpleMode) return
      if (!dialogPayload.memberName) return
      const { member } = execSearch(dialogPayload.memberName)
      router.replace(`${pathname}?member=${member}`)
    }
  }, [dialogOpenSet['member-detail'], dialogOpenSet['mobile-member-detail'], pathname])

  useEffect(() => {
    if (!pathname) return
    if (dialogOpenSet['member-mint'] || dialogOpenSet['mobile-member-mint']) {
      const params = {
        from: 'mint',
        name: dialogPayload.memberName,
        mintTo: dialogPayload.options?.mintTo,
        code: dialogPayload.options?.invitationCode,
      }
      router.replace(`${pathname}?${qs(params)}`)
    }
  }, [dialogOpenSet['member-mint'], dialogOpenSet['mobile-member-mint'], pathname])

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
        invitationCode={dialogPayload.options?.invitationCode}
        memberName={dialogPayload.options?.mintName}
        mintTo={dialogPayload.options?.mintTo}
        handleClose={() => {
          pathname && router.replace(pathname)
          closeGlobalDialog('mobile-member-mint')
        }}
      />
      <MobileMemberDetailDialog
        open={Boolean(dialogOpenSet['mobile-member-detail'])}
        brandName={dialogPayload.brandName}
        brandInfo={dialogPayload.brandInfo}
        memberName={dialogPayload.memberName}
        memberInfo={dialogPayload.memberInfo}
        handleClose={() => {
          pathname && router.replace(pathname)
          closeGlobalDialog('mobile-member-detail')
        }}
      />
      <MobileMemberBurn
        open={Boolean(dialogOpenSet['mobile-member-burn'])}
        brandName={dialogPayload.brandName}
        brandInfo={dialogPayload.brandInfo}
        memberName={dialogPayload.memberName}
        memberInfo={dialogPayload.memberInfo}
        handleClose={() => closeGlobalDialog('mobile-member-burn')}
      />
      <MobileMemberRenew
        open={Boolean(dialogOpenSet['mobile-member-renew'])}
        brandName={dialogPayload.brandName}
        brandInfo={dialogPayload.brandInfo}
        memberName={dialogPayload.memberName}
        memberInfo={dialogPayload.memberInfo}
        handleClose={() => closeGlobalDialog('mobile-member-renew')}
      />
      <MobileMemberPrimary
        open={Boolean(dialogOpenSet['mobile-member-primary'])}
        brandName={dialogPayload.brandName}
        brandInfo={dialogPayload.brandInfo}
        memberName={dialogPayload.memberName ?? ''}
        memberInfo={dialogPayload.memberInfo}
        handleClose={() => closeGlobalDialog('mobile-member-primary')}
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
            router.push(`/community/${community}?member=${member}`)
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
        invitationCode={dialogPayload.options?.invitationCode}
        memberName={dialogPayload.options?.mintName}
        mintTo={dialogPayload.options?.mintTo}
        handleClose={() => {
          pathname && router.replace(pathname)
          closeGlobalDialog('member-mint')
        }}
      />
      <BrandManageDialog
        open={Boolean(dialogOpenSet['brand-manage-setting'])}
        brandName={dialogPayload.brandName}
        brandInfo={dialogPayload.brandInfo}
        notLoaded={dialogPayload.options?.notLoaded}
        handleClose={() => closeGlobalDialog('brand-manage-setting')}
      />
      <MemberDetailDialog
        open={Boolean(dialogOpenSet['member-detail'])}
        brandName={dialogPayload.brandName}
        brandInfo={dialogPayload.brandInfo}
        memberName={dialogPayload.memberName}
        memberInfo={dialogPayload.memberInfo}
        handleClose={() => {
          pathname && router.replace(pathname)
          closeGlobalDialog('member-detail')
        }}
      />
      <MemberBurn
        open={Boolean(dialogOpenSet['member-burn'])}
        brandName={dialogPayload.brandName}
        brandInfo={dialogPayload.brandInfo}
        memberName={dialogPayload.memberName}
        memberInfo={dialogPayload.memberInfo}
        handleClose={() => closeGlobalDialog('member-burn')}
      />
      <MemberRenew
        open={Boolean(dialogOpenSet['member-renew'])}
        brandName={dialogPayload.brandName}
        brandInfo={dialogPayload.brandInfo}
        memberName={dialogPayload.memberName}
        memberInfo={dialogPayload.memberInfo}
        handleClose={() => closeGlobalDialog('member-renew')}
      />
      <MemberPrimary
        open={Boolean(dialogOpenSet['member-primary'])}
        brandName={dialogPayload.brandName}
        brandInfo={dialogPayload.brandInfo}
        memberName={dialogPayload.memberName ?? ''}
        memberInfo={dialogPayload.memberInfo}
        handleClose={() => closeGlobalDialog('member-primary')}
      />
      <BrandNotLoadedDialog
        brandName={dialogPayload.brandName}
        brandInfo={dialogPayload.brandInfo}
        open={Boolean(dialogOpenSet['brand-not-loaded'])}
        handleClose={() => closeGlobalDialog('brand-not-loaded')}
        handleConfirm={({ brandName, brandInfo }) => {
          closeGlobalDialog('brand-not-loaded')
          if (dialogPayload.mobile) {
            showGlobalDialog('mobile-manage-drawer', { brandName, brandInfo, options: { ...dialogPayload.options, notLoaded: true } })
            return
          }
          showGlobalDialog('brand-manage-setting', { brandName, brandInfo, options: { notLoaded: true } })
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
            router.push(`/community/${community}?member=${member}`)
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