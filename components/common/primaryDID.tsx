import { FC, useState, useEffect } from "react"
import Link from "next/link"

import { useWallet } from '@/hooks/wallet'
import { formatAddress } from "@/shared/helper"
import useApi from "@/shared/useApi"

interface Props {
  address: string
  noLink?: boolean
}
const PrimaryDID: FC<Props> = ({ address, noLink }) => {
  const api = useApi()
  const [defaultMember, setDefaultMember] = useState('')
  
  useEffect(() => {
    async function fetchData() {
      try {
        // primary did被删除后，defaultMember 还能获取到，这里要加一个状态判断
        const defaultMember = await api.getPrimaryMember(address)
        setDefaultMember(defaultMember || '')
      } catch (err) {}
    }
    setDefaultMember('')
    fetchData()
  }, [address])

  if (!noLink) {
    return (
      <Link href={`/address/${address}`} title={address} className="hover:underline underline-offset-2">
        {defaultMember || formatAddress(address)}
      </Link>
    )
  }

  return (
    <span title={address}>
      {defaultMember || formatAddress(address)}
    </span>
  )
}

export default PrimaryDID