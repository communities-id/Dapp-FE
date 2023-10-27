import { FC, useState } from 'react'

import { useDetails } from '@/contexts/details'

import MemberMintLatest from '@/components/mint/member/latest'

interface Props {

}

const MemberMint: FC<Props> = () => {
  const { member } = useDetails()
  return <MemberMintLatest member={member} />
}

export default MemberMint
