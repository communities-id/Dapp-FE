import { useState } from "react"
import { getRootConfig } from "@/shared/useApi"

import { ChainIDs, TestnetChainIDs } from '@communitiesid/id'

function fromStructToObjec(val: any) {
  if (val._isBigNumber) {
    return val.toString()
  }
  const struct = { ...val };
  for (let i in struct) {
    if (!isNaN(i as any)) {
      delete struct[i]
      continue
    }
    if (struct[i]._isBigNumber) {
      struct[i] = struct[i].toString()
    }
  }
  return struct;
}

export default function ConfigViewer() {

  const [chainId, setChainId] = useState(1)
  const [args, setArgs] = useState('')
  const [res, setRes] = useState({})


  async function callMethod(value: string) {
    const [contract, method] = value.split('.')
    const res = await getRootConfig(contract, method, chainId, args ? args.split('\n') : [])
    if (typeof res === 'object') {
      setRes(fromStructToObjec(res))
    } else {
      setRes(res.toString())
    }

  }

  return <div className="px-5 py-5">
    <div className="w-[600px]">
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
          <option value={TestnetChainIDs.Goerli}>Goerli</option>
          <option value={TestnetChainIDs["Polygon Mumbai"]}>Polygon Mumbai</option>
          <option value={TestnetChainIDs["Base Goerli Testnet"]}>Base Goerli Testnet</option>
          <option value={TestnetChainIDs["Optimism Goerli Testnet"]}>Optimism Goerli Testnet</option>
          <option value={TestnetChainIDs["BNB Smart Chain Testnet"]}>BNB Smart Chain Testnet</option>
          <option value={TestnetChainIDs["Scroll Sepolia Testnet"]}>Scroll Sepolia Testnet</option>
        </select>
      </div>
      <div className="form-control">
        <label className="label">
          <span className="label-text">Arguments (split by \n)</span>
        </label>
        <textarea className="textarea textarea-bordered h-24" placeholder="Args" onChange={e => setArgs(e.target.value)}></textarea>
      </div>
    </div>
    <div className="mt-4 flex gap-2 flex-wrap">
      <button className="btn" onClick={() => callMethod('CommunityRegistry.getConfig')}>CommunityRegistry.getConfig</button>
      <button className="btn" onClick={() => callMethod('CommunityRegistry.getAuthorized')}>CommunityRegistry.getAuthorized(address)</button>
      <button className="btn" onClick={() => callMethod('CommunityRegistryInterface.getConfig')}>CommunityRegistryInterface.getConfig</button>
      <button className="btn" onClick={() => callMethod('CommunityTokenURI.getConfig')}>CommunityTokenURI.getConfig</button>
      <button className="btn" onClick={() => callMethod('CommunityTokenURIValidator.getWhitelistKeyState')}>CommunityTokenURIValidator.getWhitelistKeyState(key)</button>
      <button className="btn" onClick={() => callMethod('RelayerCommunityRegistryInterface.getConfig()')}>RelayerCommunityRegistryInterface.getConfig</button>
      <button className="btn" onClick={() => callMethod('RelayerReplicaCommunityRegistryInterface.getRelayerConfig')}>RelayerReplicaCommunityRegistryInterface.getLZConfig</button>
      <button className="btn" onClick={() => callMethod('BaseNodeValidator.getConfig')}>BaseNodeValidator.getConfig</button>
      <button className="btn" onClick={() => callMethod('SubNodeValidator.getConfig')}>SubNodeValidator.getConfig</button>
      <button className="btn" onClick={() => callMethod('TextRecord.isWhitelistKey')}>TextRecord.isWhitelistKey(keyBytes)</button>
      <button className="btn" onClick={() => callMethod('MemberProtocolFee.getConfig')}>MemberProtocolFee.getConfig</button>
      <button className="btn" onClick={() => callMethod('MemberProtocolFee.getProtocolFee')}>MemberProtocolFee.getProtocolFee(address, operation)</button>
      <button className="btn" onClick={() => callMethod('MemberProtocolFee.getInterfaceFeeRate')}>MemberProtocolFee.getInterfaceFeeRate(address, operation)</button>
      <button className="btn" onClick={() => callMethod('MemberRegistry.getConfig')}>MemberRegistry.getConfig</button>
      <button className="btn" onClick={() => callMethod('MemberRegistryInterfaceFactory.getConfig')}>MemberRegistryInterfaceFactory.getConfig</button>
      <button className="btn" onClick={() => callMethod('MemberRouter.route')}>MemberRouter.route(key)</button>
      <button className="btn" onClick={() => callMethod('MemberTokenURI.getConfig')}>MemberTokenURI.getConfig</button>
    </div>
    <p className="mt-4">Result:</p>
    <div className="mt-1 border px-4 py-4 whitespace-pre">
      {JSON.stringify(res, null, 2)}
    </div>
  </div>
}