import React, { useEffect, useState } from 'react'
import { BigNumber } from 'ethers'
import { CHAINS_ID_TO_NETWORK } from "@/shared/constant"
import axios from 'axios';
import Pagination from '@/components/common/pagination';

export default function Dashboard() {

  const [list, setList] = useState([])
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)

  async function loadData(page: number) {
    const res = await axios(`/api/community/list?page=${page}`)
    const { data } = res.data
    setPage(page)
    const list = data.list.map((item: any) => ({
      ...item,
      communityInfo: JSON.parse(item.communityInfo)
    }))
    setList(list)
    setTotal(data.total)
  }

  useEffect(() => {
    loadData(1)
  }, [])
  
  return (
    <div>
      <div className="px-5 py-5">
        <div className="w-full overflow-x-auto">
          <table className="table table-compact">
            <thead>
              <tr>
                <th className="w-10 text-ellipsis">name</th>
                <th>Chain</th>
                <th>owner</th>
                <th>pool</th>
                <th>totalSupply</th>
                <th>node</th>
                <th>tokenUri</th>
                <th>priceModel</th>
                <th>config</th>
              </tr>
            </thead>
            <tbody>
              {
                list.map((item: any) => (
                  <tr key={item.id}>
                    <td className="w-10 text-ellipsis">{item.name}</td>
                    <td>{CHAINS_ID_TO_NETWORK[Number(item.chainId)]}</td>
                    <td>{item.communityInfo.owner}</td>
                    <td>{BigNumber.from(item.communityInfo.pool.hex).toString()}</td>
                    <td>{item.communityInfo.totalSupply}</td>
                    <td>{JSON.stringify(item.communityInfo.node)}</td>
                    <td>{JSON.stringify(item.communityInfo.tokenUri)}</td>
                    <td>{JSON.stringify(item.communityInfo.priceModel)}</td>
                    <td>{JSON.stringify(item.communityInfo.config)}</td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
        <div className="my-5 flex justify-center">
          <Pagination
            onPageChange={(page: number) => loadData(page)}
            totalCount={total}
            currentPage={page}
            pageSize={50}
          />
        </div>
      </div>
    </div>
  )
}