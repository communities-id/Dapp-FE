import { FC, useState } from 'react'

import { useSwitchNetwork } from 'wagmi'
import { useRoot } from '@/contexts/root'
import { useDetails } from '@/contexts/details'
import useApi from '@/shared/useApi'
import Button from '@/components/_common/button'
import { toastError } from '@/shared/helper'
import { CHAIN_ID } from '@/shared/constant'

interface Props {
  memberName: string
}

const MemberAsPrimaryContent: FC<Props> = ({ memberName }) => {
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
      toastError(message, 'Failed to set as primary: ', e, { t: 'member-set-primary', keyword: memberName, i: 1 })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='pt-[30px] px-[40px] h-full flex flex-col'>
      <h1 className='text-xl text-main-black text-center'>Set as primary</h1>
      <p className='mt-10 sm:mt-5'>Are you sure you want to set <span className='text-mintPurple'>{`<${memberName}>`}</span> as your primary identity? This will be the main DID displayed across Communities ID and other platforms.</p>
      <Button
        className='mt-5'
        mode='full'
        theme='primary'
        loading={loading}
        disabled={loading}
        size='medium'
        onClick={() => handleAsPrimary()}
      >Set as primary</Button>
    </div>
  )
}

export default MemberAsPrimaryContent