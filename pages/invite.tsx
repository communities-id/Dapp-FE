import { useState } from "react"
import { getRootConfig } from "@/shared/useApi"

import { ChainIDs, TestnetChainIDs } from '@communitiesid/id'
import axios from "axios"


export default function Invite() {

  const [chainId, setChainId] = useState(1)
  const [name, setName] = useState('')
  const [mintTo, setMintTo] = useState('')
  const [secret, setSecret] = useState('')
  const [res, setRes] = useState('')

  async function generate() {
    try {
      const res = await axios.get(`/api/sign/mint?chainId=${chainId}&secret=${secret}&name=${name}&owner=${mintTo}&isUrl=1`)
      const data = res.data
      setRes(JSON.stringify(data, null, 2))
    } catch (e: any) {
      setRes(e.message)
    }
  }


  return <div className="px-5 py-5">
    <div className="w-[800px]">
      <div className="form-control">
        <label className="label">
          <span className="label-text">Chain</span>
        </label>
        <select className="select select-bordered w-full max-w-xs" onChange={e => setChainId(Number(e.target.value))}>
          <option value={ChainIDs.Ethereum}>Ethereum</option>
          <option value={ChainIDs.Polygon}>Polygon</option>
          <option value={ChainIDs.Base}>Base</option>
          <option value={ChainIDs.OP}>OP</option>
          <option value={ChainIDs.BSC}>BSC</option>
          <option value={ChainIDs.Scroll}>Scroll</option>
          <option value={ChainIDs.Astar}>Astar</option>
          <option value={TestnetChainIDs.Goerli}>Goerli</option>
          <option value={TestnetChainIDs["Polygon Mumbai"]}>Polygon Mumbai</option>
          <option value={TestnetChainIDs["Base Goerli Testnet"]}>Base Goerli Testnet</option>
          <option value={TestnetChainIDs["Optimism Goerli Testnet"]}>Optimism Goerli Testnet</option>
          <option value={TestnetChainIDs["BNB Smart Chain Testnet"]}>BNB Smart Chain Testnet</option>
          <option value={TestnetChainIDs["Scroll Sepolia Testnet"]}>Scroll Sepolia Testnet</option>
          <option value={TestnetChainIDs["zKatana Testnet"]}>zKatana Testnet</option>
        </select>
      </div>
      <div className="form-control">
        <label className="label">
          <span className="label-text">Name</span>
        </label>
        <input className="input input-bordered" placeholder="Name" onChange={e => setName(e.target.value)} />
      </div>
      <div className="form-control">
        <label className="label">
          <span className="label-text">Mint to</span>
        </label>
        <input className="input input-bordered" placeholder="0x..." onChange={e => setMintTo(e.target.value)} />
      </div>
      <div className="form-control">
        <label className="label">
          <span className="label-text">Secret</span>
        </label>
        <input className="input input-bordered" placeholder="secret" onChange={e => setSecret(e.target.value)} />
        <p>(Get it from <a className="text-primary" href="https://vercel.com/shine-x/communitiesid/settings/environment-variables" target="_blank">https://vercel.com/shine-x/communitiesid/settings/environment-variables</a> - SIGNATURE_SECRET)</p>
      </div>
    </div>
    <div className="mt-4 flex gap-2 flex-wrap">
      <button className="btn" onClick={generate}>Generate</button>
    </div>
    <p className="mt-4">Result:</p>
    <div className="mt-1 border px-4 py-4 whitespace-pre-wrap break-all">
      {res}
    </div>
  </div>
}