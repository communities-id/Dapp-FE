import React, { useEffect, useState } from 'react'
import { CHAINS_ID_TO_NETWORK } from "@/shared/constant"
import axios from 'axios';
import Pagination from '@/components/common/pagination';

export default function Dashboard() {

  const [list, setList] = useState([])
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)

  async function loadData(page: number) {
    const res = await axios(`/api/member/list?page=${page}`)
    const { data } = res.data
    setPage(page)
    const list = data.list.map((item: any) => ({
      ...item,
      memberInfo: JSON.parse(item.memberInfo)
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
                <th>node</th>
                <th>interfaceNode</th>
                <th>tokenUri</th>
              </tr>
            </thead>
            <tbody>
              {
                list.map((item: any) => (
                  <tr key={item.id}>
                    <td className="w-10 text-ellipsis">{item.name}</td>
                    <td>{CHAINS_ID_TO_NETWORK[Number(item.chainId)]}</td>
                    <td>{item.memberInfo.owner}</td>
                    <td>{JSON.stringify(item.memberInfo.node)}</td>
                    <td>{JSON.stringify(item.memberInfo.interfaceNode)}</td>
                    <td>{JSON.stringify(item.memberInfo.tokenUri)}</td>
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