import { FC, useState } from 'react'

import { useSwitchNetwork } from 'wagmi'
import { useRoot } from '@/contexts/root'
import { useDetails } from '@/contexts/details'
import useApi from '@/shared/useApi'
import { formatContractError } from '@/shared/helper'
import { CHAIN_ID } from '@/shared/constant'

import Dialog from '@/components/common/dialog'

interface Props {
  open: boolean
  memberName: string
  handleClose?: () => void
}

const MemberAsPrimaryDialog: FC<Props> = ({ open, memberName, handleClose }) => {
  const { message } = useRoot()
  const { isMainNetwork } = useDetails()
  const { setMemberPrimary } = useApi()
  const { switchNetworkAsync } = useSwitchNetwork()
  
  const [loading, setLoading] = useState(false)
  
  const handleAsPrimary = async () => {
    if (!memberName) return
    try {
      setLoading(true)
      if (!isMainNetwork) {
        await switchNetworkAsync?.(CHAIN_ID)
      }
      await setMemberPrimary(memberName)
      message({ type: 'success', content: 'Set to primary success!' }, { t: 'member-set-primary', keyword: memberName  })
      location.reload()
    } catch (e) {
      console.error(e)
      message({
        type: 'error',
        content: 'Failed to set as primary: ' + formatContractError(e),
      }, { t: 'member-set-primary', keyword: memberName, i: 1 })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog
      open={open}
      title='Set as Primary'
      center={false}
      loading={loading}
      disableCloseBtn
      confirmText='Set as Primary'
      handleClose={handleClose}
      handleConfirm={handleAsPrimary}>
        <p>Are you sure you want to set <span className='text-mintPurple'>{`<${memberName}>`}</span> as your primary identity? This will be the main DID displayed across Communities ID and other platforms.</p>
    </Dialog>
  )
}

export default MemberAsPrimaryDialog