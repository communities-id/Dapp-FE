import { relayerList, relayerRetry } from "@/shared/apis"
import { CHAINS_ID_TO_NETWORK, SCAN_MAP } from "@/shared/constant"
import { Relayer } from "@prisma/client"
import { useEffect, useState } from "react"

export default function RelayerScanner() {

  const [list, setList] = useState<Relayer[]>([])

  async function fetchRelayerList() {
    const res = await relayerList()
    setList(res.data || [])
  }

  async function retry(id: string) {
    const res = await relayerRetry(id)
    if (res.code !== 0) {
      alert(res.message)
      return
    }
    alert('retry success')
    location.reload()
  }

  useEffect(() => {
    fetchRelayerList()
  }, [])

  function renderStatus(status: number) {
    const map: any = {
      0: 'Pending',
      1: 'Delivered',
      2: 'Blocked'
    }
    return map[status] || 'Unknown'
  }

  return <>
    <div className="overflow-x-auto max-h-[100vh]">
      <table className="table table-compact">
        <thead>
          <tr>
            <th className="w-10 text-ellipsis">ID</th>
            <th>Source chain</th>
            <th>Source contract</th>
            <th>Source hash</th>
            <th>Payload</th>
            <th>Destination chain</th>
            <th>Destination contract</th>
            <th>Destination hash</th>
            <th>Destination error</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {
            list.map(item => (
              <tr key={item.id}>
                <td className="w-10 text-ellipsis">{item.id}</td>
                <td>{Number(item.srcChain)} ({CHAINS_ID_TO_NETWORK[Number(item.srcChain)]})</td>
                <td className="w-10"><a className="link" target="blank" href={`${SCAN_MAP[Number(item.srcChain)]}/address/${item.srcAddress}`}>{item.srcAddress}</a></td>
                <td className="w-10"><a className="link" target="blank" href={`${SCAN_MAP[Number(item.srcChain)]}/tx/${item.srcTx}`}>{item.srcTx}</a></td>
                <td className="whitespace-pre-wrap">{item.payload}</td>
                <td>{Number(item.dstChain)} ({CHAINS_ID_TO_NETWORK[Number(item.dstChain)]})</td>
                <td className="w-10"><a className="link" target="blank" href={`${SCAN_MAP[Number(item.dstChain)]}/address/${item.dstAddress}`}>{item.dstAddress}</a></td>
                <td className="w-10"><a className="link" target="blank" href={`${SCAN_MAP[Number(item.dstChain)]}/tx/${item.dstTx}`}>{item.dstTx}</a></td>
                <td className="whitespace-pre-wrap">{item.dstErr}</td>
                <td>{renderStatus(item.status)}</td>
                <td>{<button className="btn btn-primary" onClick={() => retry(item.id)}>Retry</button>}</td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  </>
}