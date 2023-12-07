import React, { useEffect, useState } from 'react'
import { CHAINS_ID_TO_NETWORK } from "@/shared/constant"
import axios from 'axios';
import Pagination from '@/components/common/pagination';

export default function Dashboard() {

  const [list, setList] = useState([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)

  async function loadData(page: number) {
    try {
      const res = await axios(`/api/member/list?page=${page}`)
      const { data } = res.data
      setPage(page)
      const list = data.list.map((item: any) => ({
        ...item,
        memberInfo: JSON.parse(item.memberInfo)
      }))
      setList(list)
      setTotal(data.total)
    } catch (e) { } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData(1)
  }, [])
  
  return (
    <div>
      <div className="px-5 py-5">
        <h2 className="text-2xl">
          Total Count: {total}
        </h2>
        <div className="w-full overflow-x-auto">
          <table className="table table-compact w-full">
            <thead>
              <tr>
                <th className="w-10 text-ellipsis">name</th>
                <th>Chain</th>
                <th>owner</th>
              </tr>
            </thead>
            <tbody>
              {
                loading ? (
                  <tr>
                    <td colSpan={5} className="text-center text-lg">loading...</td>
                  </tr>
                ) : list.map((item: any) => (
                  <tr key={item.id}>
                    <td className="w-10 text-ellipsis">{item.name}</td>
                    <td>{CHAINS_ID_TO_NETWORK[Number(item.chainId)]}</td>
                    <td>{item.memberInfo.owner}</td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
        <div className="my-5 flex justify-center">
          {!loading && <Pagination
            onPageChange={(page: number) => loadData(page)}
            totalCount={total}
            currentPage={page}
            pageSize={50}
          />
          }
        </div>
      </div>
    </div>
  )
}